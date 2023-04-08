import { Link } from "react-router-dom"
import { HomeIcon } from "../icons/HomeIcon"
import { UserIcon } from "../icons/UserIcon"
import { SettingsIcon } from "../icons/SettingsIcon"

import "./Sidebar.css"
import { CloudIcon } from "../icons/CloudIcon"
import { PowerIcon } from "../icons/PoweIcon"

export function Sidebar() {

  function logout() {
    localStorage.removeItem("token")
  }

  return (
    <aside className="sidebar">
      <div className="logo">
        <CloudIcon />
      </div>
      <div id="divisor"></div>
      <ul>
        <li>
          <Link to={"/"}>
            <HomeIcon />
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