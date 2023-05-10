import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { DeleteFileIcon } from "../../components/icons/DeleteFileIcon"
import { DownloadIcon } from "../../components/icons/DownloadIcon"
import { UploadIcon } from "../../components/icons/UploadIcon"

import { invoke } from '@tauri-apps/api/tauri'
import { save } from "@tauri-apps/api/dialog"

import { api } from "../../services/api"

import "./HomePage.css"
import { Sidebar } from "../../components/sidebar/Sidebar"
import jwtDecode from "jwt-decode"

export function HomePage() {
  const [filesList, setFilesList] = useState([])
  const [file, setFile] = useState(null)

  const token = localStorage.getItem("token")
  const decodedToken = jwtDecode(token)

  useEffect(() => {
    if(token === null || Date.now() >= decodedToken.exp * 1000) 
      window.location.href = "/sign-in"

    async function loadFilesList() {
      try {
        const response = await api.get("/cloud/list-files", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
  
        setFilesList(response.data)
      } catch(err) {
        toast.error("Failed to load file list!")
      }
    }

    loadFilesList()
  }, [])

  async function reloadPage() {
    try {
      const response = await api.get("/cloud/list-files", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      setFilesList(response.data)
    } catch(err) {
      toast.error("Failed to reload file list!")
    }
  }

  async function uploadFile(event) {
    event.preventDefault()

    if(!file)
      toast.error("No files selected for upload!")

    const data = new FormData()

    data.append("upload", file[0])

    try {
      toast.info("Uploading the file...")

      await api.post("/cloud/upload", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${token}`
        }
      })

      toast.success("Success uploading the file!")

      await reloadPage()
    } catch(err) {
      toast.error("Failed to upload the file!")
    }
  }
  
  async function downloadFile(filename) {
    try {      
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
        const downloadPath = await save({
          defaultPath: `/home/${filename}`
        })

        toast.info("Downloading the file...")
  
        invoke("download_file", {
          url: downloadUrl,
          path: downloadPath.replace(filename, "")
        })
      }

      toast.success("Success downloading the file!")
    } catch(err) {
      toast.error("Failed to download file!")
    }
  }

  async function deleteFile(filename) {
    try {
      await api.delete("/cloud/delete-file", {
        params: {
          filename: filename
        },
        headers: {
          "Authorization": `Bearer ${token}`
        },
      })

      toast.success("File successfully deleted!")
      await reloadPage()
    } catch(err) {
      toast.error("Failed to delete the file!")
    }
  }
 
  return(
    <div className="home-page">
      <Sidebar/>
      <div className="files-manager">
        <h4>Upload</h4>

        <form className="upload-form" onSubmit={uploadFile}>
          <span>Choose a file to upload:</span>
          <input 
            type="file" 
            name="file"
            onChange={event => {setFile(event.target.files)}}
          />
          <button type="submit" className="upload-button">
            <UploadIcon/>
            <span>Upload</span>
          </button>
        </form>
        <h4>All Files</h4>
        <ul> 
          <li className="list-description">
            <span className="filename-d">File Name</span>

            <span className="filesize">File Size</span>
          </li>
          {filesList.length ? filesList.map(file => {
            return <li key={file.key} className="file-info">
              <div className="filename">
                <span>{file.key}</span>
              </div>
              
              <div className="filesize">  
                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
              </div>

              <div className="action-icons">
                <button onClick={() => downloadFile(file.key)}>
                  <i>
                    <DownloadIcon />
                    <span>Download</span>
                  </i>
                </button>

                <button onClick={() => deleteFile(file.key)}>
                  <i>
                    <DeleteFileIcon />
                    <span>Delete</span>
                  </i>
                </button>
              </div>
            </li>
          }) : <div className="no-files-message"><h2>No files found</h2></div>}
        </ul>
      </div>
      <ToastContainer />
    </div>
  )
}