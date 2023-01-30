import { useEffect, useState } from "react"

import { DeleteFileIcon } from "../../components/icons/DeleteFileIcon"
import { DownloadIcon } from "../../components/icons/DownloadIcon"
import { ReloadIcon } from "../../components/icons/ReloadIcon"
import { UploadIcon } from "../../components/icons/UploadIcon"

import { save } from "@tauri-apps/api/dialog"

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

  function reloadPage() {
    window.location.href = "/"
  }

  
  async function downloadFile(filename) {
    
    const response = await api.get("/cloud/download", {
      params: {
        filename: filename
      },
      headers: {
        "Authorization": `Bearer ${token}`
      },
    })

    const downloadUrl = response.data.download_url

    if(downloadUrl) {
      /*
      const downloadPath = await save({
        defaultPath: `/home/guilherme/Downloads/${filename}`
      })*/
      
      console.log(downloadUrl)

      const a = document.createElement("a")
      a.style.display = "none"
      a.href = downloadUrl
      a.download = `${filename}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  async function deleteFile(filename) {
    await api.delete("/cloud/delete-file", {
      params: {
        filename: filename
      },
      headers: {
        "Authorization": `Bearer ${token}`
      },
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
        <button type="submit" className="upload-button">
          <UploadIcon/>
          <span>Upload</span>
        </button>
        
        <button className="reload-button" onClick={reloadPage}>
          <ReloadIcon/>
          <span>Reload</span>
        </button>
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
              <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
            </div>

            <div className="last-modified">
              <span>{file.last_modified}</span>
            </div>

            <div className="action-icons">
              <button onClick={() => downloadFile(file.key)}>
                <i><DownloadIcon /></i>
              </button>

              <button onClick={() => deleteFile(file.key)}>
                <i><DeleteFileIcon /></i>
              </button>
            </div>
          </li>
        }) : <div className="no-files-message"><h2>No files found</h2></div>}
      </ul>
    </div>
  )
}