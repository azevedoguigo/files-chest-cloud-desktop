import { useState } from "react"
import { UploadIcon } from "../../components/icons/UploadIcon"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { api } from "../../services/api"

export function UploadInput() {
  const [file, setFile] = useState(null)

  const token = localStorage.getItem("token")

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

    } catch(err) {
      console.log(err)
      toast.error("Failed to upload the file!")
    }
  }

  return (
    <>
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
    </>
  )
}