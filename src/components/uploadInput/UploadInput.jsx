import { useState } from "react"
import { UploadIcon } from "../../components/icons/UploadIcon"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { api } from "../../services/api"

export function UploadInput({reloadPage}) {
  const [file, setFile] = useState(null)

  const token = localStorage.getItem("token")

  async function uploadFile(event) {
    event.preventDefault()

    if(!file)
      toast.error("No files selected for upload!")

    const data = new FormData()

    data.append("upload", file[0])

    try {
      toast.info("Uploading the file...", {theme: "dark"})

      await api.post("/cloud/upload", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${token}`
        }
      })

      reloadPage()
      toast.success("Success uploading the file!", {theme: "dark"})
    } catch(err) {
      console.log(err)
      toast.error("Failed to upload the file!", {theme: "dark"})
    }
  }

  return (
    <div className="text-zinc-50 rounded-md">
      <h4 className="text-3xl mb-2 font-bold">
        Upload Files
      </h4>
      
      <div className="px-4">
        <form 
          onSubmit={uploadFile}
          className="flex items-center justify-around bg-base-200 rounded-2xl p-4"
        >
          <input
            type="file"
            className="file-input file-input-bordered file-input-success w-[50vw]" 
            onChange={event => {setFile(event.target.files)}}
          />
          <button 
            type="submit" 
            className="btn btn-success w-52"
          >
            <UploadIcon/>
            <span className="ml-1 text-lg">
              Upload
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}