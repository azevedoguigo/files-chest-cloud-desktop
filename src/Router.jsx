import { Route, Routes } from "react-router-dom"

import { HomePage } from "./pages/HomePage/HomePage"
import { ProfilePage } from "./pages/ProfilePage/ProfilePage"
import { SettingsPage } from "./pages/SettingsPage/SettingsPage"
import { SignInPage } from "./pages/SignInPage/SignInPage"
import { SignUpPage } from "./pages/SignUpPage/SignUpPage"

export function Router() {
  return(
		<Routes>
			<Route path="/" element={ <HomePage /> }/>
			<Route path="/sign-in" element={<SignInPage />}/>
			<Route path="/sign-up" element={<SignUpPage />}/>
			<Route path="/profile" element={<ProfilePage />}/>
			<Route path="/settings" element={<SettingsPage />}/>
		</Routes>
	)
}