import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { api } from "../../services/api"

import "./SignUpPage.css"

export function SignUpPage() {
  const { 
    register, 
    handleSubmit,  
    formState: { errors }
  } = useForm()

  async function onSubmit(data) {

    const response = await api.post('/users', {
      name: data.name,
      email: data.email,
      password: data.password
    })

    if(response.status == 201) window.location.href = "/sign-in"
  }

  return(
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
  )
}