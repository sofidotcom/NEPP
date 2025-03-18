import { useState } from "react"
import axios from "axios"

const UploadPDF = () => {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
 
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!file) {
      setMessage("Please choose a PDF file to upload.")
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("subject", subject)
   
    formData.append("file", file)

    try {
      // Get the token from localStorage or your auth state
      const token = localStorage.getItem("token")

      if (!token) {
        setMessage("You must be logged in to upload files")
        setLoading(false)
        return
      }

      const response = await axios.post("/api/v1/pdfs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Add the token to the request
        },
      })

      setMessage(response.data.message)
      // Clear form after successful upload
      setTitle("")
      setSubject("")
      
      setFile(null)
      // Reset file input
      document.getElementById("file-input").value = ""
    } catch (error) {
      console.error("Upload error:", error)
      setMessage(error.response?.data?.message || "Error uploading file.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="upload-container">
      <h2>Upload PDF</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
      
        <div className="form-group">
          <label>PDF File:</label>
          <input id="file-input" type="file" onChange={handleFileChange} accept="application/pdf" required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && <p className={message.includes("Error") ? "error-message" : "success-message"}>{message}</p>}
    </div>
  )
}

export default UploadPDF
