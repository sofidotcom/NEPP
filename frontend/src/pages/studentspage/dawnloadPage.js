
import { useEffect, useState } from "react";
import axios from "axios";
import '../../css/pdfDownload.css'

const StudentPDFList = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("/api/v1/pdfs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPdfs(response.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      setMessage("Failed to load PDFs.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (id, title) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`/api/v1/pdfs/download/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Important for downloading files
      });

      // Create a blob and trigger download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${title}.pdf`;
      link.click();

      setMessage(`Downloaded ${title}`);
      
      // Update the local state to mark this PDF as downloaded
      setPdfs(prevPdfs => 
        prevPdfs.map(pdf => 
          pdf._id === id 
            ? { ...pdf, isDownloaded: true, downloadedAt: new Date() } 
            : pdf
        )
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setMessage("Failed to download PDF.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="student-pdf-container">
      <h2>Available PDFs</h2>
      {loading ? (
        <p>Loading PDFs...</p>
      ) : (
        <>
          {message && <p className="status-message">{message}</p>}
          {pdfs.length === 0 ? (
            <p>No PDFs available.</p>
          ) : (
            <ul className="pdf-list">
              {pdfs.map((pdf) => (
                <li key={pdf._id} className={`pdf-item ${pdf.isDownloaded ? 'downloaded' : ''}`}>
                  <div className="pdf-info">
                    <h3>{pdf.title}</h3>
                    <p>Subject: {pdf.subject}</p>
                    
                    {pdf.teacher && (
                      <p>
                        Teacher: {pdf.teacher.name} ({pdf.teacher.subject})
                      </p>
                    )}
                    
                    {pdf.isDownloaded && (
                      <p className="download-status">
                        <span className="download-icon">✓</span> 
                        Downloaded on {formatDate(pdf.downloadedAt)}
                      </p>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => downloadPDF(pdf._id, pdf.title)} 
                    className={`download-btn ${pdf.isDownloaded ? 'redownload' : ''}`}
                  >
                    {pdf.isDownloaded ? 'Download Again' : 'Download'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default StudentPDFList;

