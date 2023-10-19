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
    <div className="sigin-page flex items-center justify-center bg-zinc-950 h-screen">
      <div className="flex flex-col items-center justify-center border border-zinc-800 rounded-md p-4 text-zinc-300 w-5/12">
        <h3 className="font-bold text-xl pb-8">SignUp</h3>

        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="flex flex-col w-full"
        >
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name" 
            className="bg-zinc-800 p-3 border-none rounded-md mb-3"
            {...register("name", {required: true})}
          />
          {errors.name && <p>Name is required!</p>}

          <input 
            type="text" 
            name="email" 
            placeholder="Your Email Address" 
            className="bg-zinc-800 p-3 border-none rounded-md mb-3"
            {...register("email", { required: true })}
          />
          {errors.email && <p>Email is required!</p>}

          <input 
            type="password" 
            name="password" 
            placeholder="Your Password" 
            className="bg-zinc-800 p-3 border-none rounded-md"
            {...register("password", { required: true })}
          />
          {errors.password && <p>Password is required!</p>}

          <span className="mt-3 mb-6">
            Already have an account? 
            <Link 
              to={"/sign-in"}
              className="text-blue-500 ml-1"
            >
              SignIn
            </Link>
          </span>

          <button 
            type="submit"
            className="bg-green-500 font-bold mb-2 py-3 px-4 rounded-md hover:bg-green-600"
          >
            Create Account
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  )
}