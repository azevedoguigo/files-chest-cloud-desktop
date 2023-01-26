import { Route, Routes } from "react-router-dom"

import { HomePage } from "./pages/HomePage/HomePage"
import { SignInPage } from "./pages/SignInPage/SignInPage"

export function Router() {
  return(
		<Routes>
			<Route path="/" element={ <HomePage /> }/>
			<Route path="/sign-in" element={<SignInPage />}/>
		</Routes>
	)
}