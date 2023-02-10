import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { api } from "../../services/api"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import "./SignUpPage.css"

export function SignUpPage() {
  const { 
    register, 
    handleSubmit,  
    formState: { errors }
  } = useForm()

  async function onSubmit(data) {
    try {
      const response = await api.post('/users', {
        name: data.name,
        email: data.email,
        password: data.password
      })
  
      if(response.status == 201) window.location.href = "/sign-in"
    } catch(err) {
      if(err.response.status == 400){ 
        let requestErrors = err.response.data.error
        
        if(requestErrors.name)
          toast.warning(`Invalid name: ${requestErrors.name[0]}`)

        if(requestErrors.email)
          toast.warning(`Invalid email: ${requestErrors.email[0]}`)

        if(requestErrors.password)
          toast.warning(`Invalid password: ${requestErrors.password[0]}`)
        
      } else
        toast.error("Sign Up fail! Wait a few moments and try again.")
    }
  }

  return(
    <div className="sign-up-container">
      <div className="sign-up-page">
        <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
          <h3>SignUp</h3>
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            {...register("name", {required: true})}
          />
          {errors.name && <p>Name is required!</p>}

          <input 
            type="text" 
            name="email" 
            placeholder="Your Email Address" 
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

          <span>Already have an account? <Link to={"/sign-in"}>SignIn</Link></span>

          <button type="submit">Create Account</button>
        </form>
      </div>

      <ToastContainer />
    </div>
  )
}