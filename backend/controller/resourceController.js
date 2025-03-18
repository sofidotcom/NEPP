const PDF = require("../model/pdfModel")
const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken")

// Upload PDF
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

    // Create the PDF document object - note we're not including filePath since it won't be saved
    const pdfData = {
      title,
      subject,
      uploadedBy: decodedToken.userId,
      fileUrl: fileUrl,
    };
    
    // Save the PDF document in the database
    const newPDF = new PDF(pdfData);
    const savedPDF = await newPDF.save();
    
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
// Get all PDFs (student view)
exports.getAllPDFs = async (req, res) => {
  try {
    // Don't use populate for now to avoid the User model error
    const pdfs = await PDF.find()

    // Return the PDFs without trying to populate teacher info
    res.status(200).json(pdfs)
  } catch (error) {
    console.error("Error fetching PDFs:", error)
    res.status(500).json({ message: "Error fetching PDFs", error: error.message })
  }
}





