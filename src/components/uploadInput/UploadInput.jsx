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
    <div className="text-zinc-50 border border-zinc-700 rounded-md p-2 w-2/3 max-w-2xl">
      <form 
        onSubmit={uploadFile}
      >
        <span className="font-bold">
          Choose a file to upload:
        </span>
        <input 
          type="file" 
          name="file"
          class="block w-full mb-5 mt-2 text-xs text-zinc-50 rounded-md cursor-pointer bg-zinc-800" 
          id="small_size"
          onChange={event => {setFile(event.target.files)}}
        />
        <button 
          type="submit" 
          className="flex flex-row items-center justify-center bg-green-500 rounded-md w-full hover:bg-green-600"
        >
          <UploadIcon/>
          <span className="ml-2 font-bold">Upload</span>
        </button>
      </form>
    </div>
  )
}