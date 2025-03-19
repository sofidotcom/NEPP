const PDF = require("../model/pdfModel")
const Student = require("../model/signupUserModel"); 
const Notification = require("../model/notificationModel");
const PDFDownload = require("../model/pdfDownloadModel");
const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken")

// Upload PDF
// Upload PDF
exports.uploadPDF = async (req, res) => {
  try {
    const { title, subject } = req.body;

    // Multer puts the file info in req.file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    // Get just the filename
    const fileName = path.basename(req.file.path);
    
    // Create the file URL (relative URL for web access)
    const fileUrl = `/uploadedPdfs/${fileName}`;
    
    // Extract teacher ID from JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, "yourSecretKey");
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Check if user is a teacher
    if (decodedToken.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can upload PDFs" });
    }

    // Create the PDF document object
    const pdfData = {
      title,
      subject,
      uploadedBy: decodedToken.userId,
      fileUrl: fileUrl,
    };
    
    // Save the PDF document in the database
    const newPDF = new PDF(pdfData);
    const savedPDF = await newPDF.save();
    
    // Create a notification for this PDF upload
   try {
  // Find students who should receive this notification (e.g., by subject)
  // This assumes you have a way to match students to subjects
  // If you don't have this relationship yet, you can create a notification for all students
  
  // Option 1: Create notification for specific students by subject
  // const students = await Student.find({ subjects: { $in: [subject] } });
  // const studentIds = students.map(student => student._id);
  
  // Option 2: Create a general notification without specific recipients
  const notification = new Notification({
    title: "New Study Material Available",
    message: `A new document "${title}" has been uploaded for ${subject}`,
    type: "pdf_upload",
    relatedItem: {
      itemId: savedPDF._id,
      itemType: "PDF"
    },
    subject: subject,
    readBy: [], // Initialize with empty array
    // recipients: studentIds // Uncomment if using Option 1
  });
  
  await notification.save();
  console.log("Notification created for new PDF upload");
} catch (notificationError) {
  console.error("Error creating notification:", notificationError);
  // Continue with the response even if notification creation fails
}
    
    res.status(201).json({
      message: "PDF uploaded successfully",
      pdf: {
        id: savedPDF._id,
        title: savedPDF.title,
        subject: savedPDF.subject,
        fileUrl: savedPDF.fileUrl,
        uploadedBy: savedPDF.uploadedBy,
      },
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Error uploading PDF", error: error.message });
  }
};
// Download PDF by ID (unchanged)

exports.downloadPDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    // Extract user ID from JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, "yourSecretKey");
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decodedToken.userId;
    const userRole = decodedToken.role;

    // Only track downloads for students
    if (userRole === "student") {
      try {
        // Record the download (upsert in case they've downloaded before)
        await PDFDownload.findOneAndUpdate(
          { pdfId: pdf._id, studentId: userId },
          { downloadedAt: new Date() },
          { upsert: true, new: true }
        );
      } catch (trackError) {
        console.error("Error tracking download:", trackError);
        // Continue with download even if tracking fails
      }
    }

    // Extract the filename from the fileUrl
    const fileName = path.basename(pdf.fileUrl);
    
    // Reconstruct the absolute path
    const filePath = path.resolve(process.cwd(), 'uploadedPdfs', fileName);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        message: "PDF file not found on server", 
        path: filePath
      });
    }

    // Send the file for download
    res.download(filePath, `${pdf.title}.pdf`, (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(500).json({ message: "Error downloading PDF", error: err.message });
      }
    });
  } catch (error) {
    console.error("Error in download route:", error);
    res.status(500).json({ message: "Error downloading PDF", error: error.message });
  }
};

// Get all PDFs with download status for the current student
exports.getAllPDFs = async (req, res) => {
  try {
    // Extract user ID from JWT token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, "yourSecretKey");
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = decodedToken.userId;
    const userRole = decodedToken.role;

    // Get all PDFs
    const pdfs = await PDF.find();

    // If user is a student, get their download history
    if (userRole === "student") {
      // Get all downloads for this student
      const downloads = await PDFDownload.find({ studentId: userId });
      
      // Create a map of pdfId -> downloadedAt for quick lookup
      const downloadMap = {};
      downloads.forEach(download => {
        downloadMap[download.pdfId.toString()] = download.downloadedAt;
      });
      
      // Add download status to each PDF
      const pdfsWithStatus = pdfs.map(pdf => {
        const pdfObj = pdf.toObject();
        const pdfId = pdf._id.toString();
        
        pdfObj.isDownloaded = pdfId in downloadMap;
        if (pdfObj.isDownloaded) {
          pdfObj.downloadedAt = downloadMap[pdfId];
        }
        
        return pdfObj;
      });
      
      return res.status(200).json(pdfsWithStatus);
    }
    
    // For non-students, just return the PDFs without download status
    res.status(200).json(pdfs);
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    res.status(500).json({ message: "Error fetching PDFs", error: error.message });
  }
};





