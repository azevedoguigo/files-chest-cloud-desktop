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

  async function onSubmit(data) {
    const response = await api.post('/users/signin', {
      email: data.email,
      password: data.password
    })

    if(response.status == 200) {
      localStorage.setItem("token", response.data)
      window.location.href = "/"
    }

    console.log(response.status, response.statusText)
  }

  return(
    <div className="sigin-page">
      <form onSubmit={ handleSubmit(onSubmit) }>
        <h3>SignIn</h3>

        <input 
          type="email" 
          name="email" 
          placeholder="Your Email" 
          {...register("email", { required: true })}
        />
        {errors.email && <p>Email is required!</p>}

        <input 
          type="password" 
          name="password" 
          placeholder="Your Password" 
          {...register("password", { required: true })}
        />
        {errors.password && <p>Password is required!</p>}

        <span>Don't have an account yet? <Link to={"/sign-up"}>SignUp</Link></span>

        <button type="submit">Let's Go!</button>
      </form>
    </div>
  )
}