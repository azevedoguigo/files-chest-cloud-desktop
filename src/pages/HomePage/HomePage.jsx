import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { DeleteFileIcon } from "../../components/icons/DeleteFileIcon"
import { DownloadIcon } from "../../components/icons/DownloadIcon"

import { invoke } from '@tauri-apps/api/tauri'
import { save } from "@tauri-apps/api/dialog"

import { api } from "../../services/api"

import { Sidebar } from "../../components/sidebar/Sidebar"
import jwtDecode from "jwt-decode"
import { UploadInput } from "../../components/uploadInput/UploadInput"

export function HomePage() {
  const [filesList, setFilesList] = useState([])

  const token = localStorage.getItem("token")

  useEffect(() => {
    if(!token)
      window.location.href = "/sign-in"

    const Decodedtoken = jwtDecode(token)

    if(Date.now() >= token.exp * 1000) 
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
    <div className="flex flex-row bg-zinc-900">
      <Sidebar/>
      <div className="px-12 py-10 w-full">
        <UploadInput />

        <h4 className="text-3xl mt-6">All Files</h4>
        <li className="list-description">
          <span className="filename">File Name</span>

          <span className="filesize">File Size</span>
        </li>
        
        <ul> 
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