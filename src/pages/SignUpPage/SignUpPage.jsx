import { useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../../services/api"

import "./SignUpPage.css"

export function SignUpPage() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    console.log(email, password)

    await api.post('/users', {
      name: name,
      email: email,
      password: password
    })
  }

  return(
    <div>
      <form onSubmit={handleSubmit} className="sign-up-form">
        <h3>SignUp</h3>
        <input 
          type="text" 
          name="name" 
          placeholder="Your Name" 
          onChange={event => setName(event.target.value)}
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Your Email Address" 
          onChange={event => setEmail(event.target.value)}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Your Password" 
          onChange={event => setPassword(event.target.value)}
        />

        <span>Already have an account? <Link to={"/sign-in"}>SignIn</Link></span>

        <button type="submit">
          <Link to={"/sign-in"}>Create Account</Link>
        </button>
      </form>
    </div>
  )
}