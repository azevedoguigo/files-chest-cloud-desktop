import { useEffect, useState } from "react"
import { api } from "../../services/api"

import "./HomePage.css"

export function HomePage() {
  const [filesList, setFilesList] = useState([])
  const [file, setFile] = useState(null)

  const token = localStorage.getItem("token") 

  useEffect(() => {
    if(token === null) window.location.href = "/sign-in"

    async function loadFilesList() {
      const response = await api.get("/cloud/list-files", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      setFilesList(response.data)
    }

    loadFilesList()
  }, [])

  async function uploadFile(event) {
    event.preventDefault()

    const data = new FormData()

    data.append("upload", file[0])
    console.log(file[0])

    await api.post("/cloud/upload", data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        "Authorization": `Bearer ${token}`
      }
    })
  }

  return(
    <div className="home-page">
      <form className="upload-form" onSubmit={uploadFile}>
        <span>Upload File</span>
        <input 
          type="file" 
          name="file"
          onChange={event => {setFile(event.target.files)}}
        />
        <button type="submit" className="upload-button">Upload</button>
      </form>

      <ul> 
        <li className="list-description">
          <span className="filename">Filename</span>

          <span className="divisor">|</span>

          <span className="filesize">Filesize</span>

          <span className="divisor">|</span>

          <span className="filename">Last Modified</span>
        </li>
        {filesList.length ? filesList.map(file => {
          return <li key={file.key} className="file-info">
            <div className="filename">
              <span>{file.key}</span>
            </div>
            
            <div className="filesize">  
              <span>{file.size}</span>
            </div>

            <div className="last-modified">
              <span>{file.last_modified}</span>
            </div>
          </li>
        }) : <div className="no-files-message"><h2>No files found</h2></div>}
      </ul>
    </div>
  )
}