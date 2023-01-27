import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { api } from "../../services/api"

import "./SignInPage.css"

export function SignInPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    console.log(email, password)

    const respose = await api.post('/users/signin', {
      email: email,
      password: password
    })

    console.log(respose)

    const navigate = useNavigate()
    navigate("/")
  }

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <h3>SignIn</h3>
        <input 
          type="email" 
          name="email" 
          placeholder="Your Email" 
          onChange={event => setEmail(event.target.value)}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Your Password" 
          onChange={event => setPassword(event.target.value)}
        />

        <span>Don't have an account yet? <Link to={"/sign-up"}>SignUp</Link></span>

        <button type="submit">Let's Go!</button>
      </form>
    </div>
  )
}