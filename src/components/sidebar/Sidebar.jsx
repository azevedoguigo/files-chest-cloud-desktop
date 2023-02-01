import { Link } from "react-router-dom"
import { HomeIcon } from "../icons/HomeIcon"
import { UserIcon } from "../icons/UserIcon"
import { SettingsIcon } from "../icons/SettingsIcon"

import "./Sidebar.css"
import { CloudIcon } from "../icons/CloudIcon"

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <CloudIcon />
      </div>
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
        <li>
          <Link to={"/settings"}>
            <SettingsIcon />
          </Link>
        </li>
      </ul>
    </aside>
  )
}