import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { api } from "../../services/api"

import "./SignInPage.css"

export function SignInPage() {
  const { 
    register, 
    handleSubmit,  
    formState: { errors }
  } = useForm()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function onSubmit(event) {
    event.preventDefault()

    const respose = await api.post('/users/signin', {
      email: email,
      password: password
    })

    if(respose.status == 200) {
      localStorage.setItem("token", respose.data)
      window.location.href = "/"
    }

    console.log(respose.status, respose.statusText)
  }

  return(
    <div>
      <form onSubmit={ handleSubmit(onSubmit(event)) }>
        <h3>SignIn</h3>

        <input 
          type="email" 
          name="email" 
          placeholder="Your Email" 
          {...register("email", { required: true })}
          onChange={event => setEmail(event.target.value)}
        />
        {errors.email && <p>Email is required!</p>}

        <input 
          type="password" 
          name="password" 
          placeholder="Your Password" 
          {...register("password", { required: true })}
          onChange={event => setPassword(event.target.value)}
        />
        {errors.password && <p>Password is required!</p>}

        <span>Don't have an account yet? <Link to={"/sign-up"}>SignUp</Link></span>

        <button type="submit">Let's Go!</button>
      </form>
    </div>
  )
}