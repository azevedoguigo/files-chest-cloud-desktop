import { Link } from "react-router-dom"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

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
    try {
      const response = await api.post('/users/signin', {
        email: data.email,
        password: data.password
      })
  
      if(response.status == 200) {
        localStorage.setItem("token", response.data.token)
        window.location.href = "/"
      }
    } catch(err) {
      if(err.response.status == 401)
        toast.warning(err.response.data.message)

      if(err.response.status == 400 || err.response.status == 500)
        toast.error("SignIn fail! Wait a few moments and try again.")
    }
  }

  return(
    <div 
      className="sigin-page flex items-center justify-center bg-zinc-950 h-screen"
    >
      <div 
        className="flex flex-col items-center justify-center border border-zinc-800 rounded-md p-4 text-zinc-300 w-5/12"
      >
        <h3 className="font-bold text-xl pb-8">SignIn</h3>

        <form 
          onSubmit={ handleSubmit(onSubmit) }
          className="flex flex-col w-full gap-2"
        >
          <label className="input input-bordered flex items-center gap-2">
            Email
            <input 
              type="email" 
              name="email" 
              placeholder="email@example.com"
              className="grow"
              {...register("email", { required: true })}
            />
          </label>
          {errors.email && <p>Email is required!</p>}

          <label className="input input-bordered flex items-center gap-2">
            Password
            <input 
              type="password" 
              name="password" 
              placeholder="********"
              className="grow"
              {...register("password", { required: true })}
            />
          </label>
          {errors.password && <p>Password is required!</p>}

          <span className="mt-3 mb-3">Don't have an account yet?  
            <Link className="text-blue-500                                                                                                                                                         ml-1" to={"/sign-up"}>SignUp</Link>
          </span>

          <button 
            type="submit"
            className="btn btn-success text-lg"
          >
            Let's Go!
          </button>
        </form>
      </div>

      <ToastContainer />
    </div>
  )
}