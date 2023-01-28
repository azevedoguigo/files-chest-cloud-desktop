import { useEffect, useState } from "react"
import { api } from "../../services/api"

import "./HomePage.css"

export function HomePage() {
  const [filesList, setFilesList] = useState([])

  const token = localStorage.getItem("token") 

  useEffect(() => {
    if(token === null) window.location.href = "/sign-in"
    console.log(filesList)
    async function loadFilesList() {
      const response = await api.get("/list-files", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      setFilesList(response.data)
    }

    loadFilesList()
  }, [])

  return(
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
      }) : <div>No files found</div>}
    </ul>
  )
}