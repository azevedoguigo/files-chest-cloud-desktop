import { Link } from "react-router-dom"
import { FileIcon } from "../icons/FileIcon"
import { UserIcon } from "../icons/UserIcon"
import { CloudIcon } from "../icons/CloudIcon"
import { PowerIcon } from "../icons/PoweIcon"

export function Sidebar() {

  function logout() {
    localStorage.removeItem("token")
  }

  return (
    <aside className="flex flex-col items-center justify-center bg-zinc-950 h-screen px-4">
      <div>
        <CloudIcon />
      </div>
      <div className="bg-zinc-500 h-0.5 w-full"></div>
      <ul className="flex flex-col justify-center h-5/6">
        <li className="pb-5">
          <Link to={"/"}>
            <FileIcon />
          </Link>
        </li>
        <li>
          <Link to={"/profile"}>
            <UserIcon />
          </Link>
        </li>
      </ul>
      <Link to={"/sign-in"} className="logout-button" onClick={logout}>
        <PowerIcon />
      </Link>
    </aside>
  )
}