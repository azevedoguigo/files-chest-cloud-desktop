import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Sidebar } from "../../components/sidebar/Sidebar";
import { api } from "../../services/api";

export function ProfilePage() {
  const [userData, setUserData] = useState({})

  const token = localStorage.getItem("token") 

  useEffect(() => {
    if(token === null) window.location.href = "/sign-in"
    
    async function loadUserData() {
      try {
        const response = await api.get("/users/current", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        setUserData(response.data.user)
      } catch(err) {
        toast.error("Failed to load your account data!")
      }
    }

    loadUserData()
  }, [])
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  async function onSubmit(data) {
    try {
      let updatedParams = {
        id: userData.id,
        name: data.name,
        email: data.email,
        password: data.password,
        currentPassword: data.confirmPassword
      }

      if(!data.name)
        updatedParams.name = userData.name
      
      if(!data.email)
        updatedParams.email = userData.email

      if(!data.password)
        updatedParams.password = userData.password
  
      await api.put("/users", updatedParams, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      toast.success("Profile updated!")
    } catch(err) {
      if(err.response.status == 400){ 
        let requestErrors = err.response.data.error

        if(err.response.data.message)
          toast.warning(err.response.data.message)
        
        if(requestErrors.name)
          toast.warning(`Invalid name: ${requestErrors.name[0]}`)

        if(requestErrors.email)
          toast.warning(`Invalid email: ${requestErrors.email[0]}`)

        if(requestErrors.password)
          toast.warning(`Invalid password: ${requestErrors.password[0]}`)
        
      } else
        toast.error("Fail to update the profile!")
    }
  }

  return (
    <div className="flex flex-row bg-zinc-900">
      <Sidebar />
      <div className="w-full text-zinc-50 px-14 py-12">
        <h2 className="text-3xl font-bold">
          Account Details
        </h2>

        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="py-6"
        >
          <h4 className="text-2xl font-medium mb-1">
            Name
          </h4>
          <input 
            type="text" 
            name="name"
            placeholder={userData.name}
            className="bg-zinc-800 w-1/3 p-2 mb-4 border-none rounded-md"
            {...register("name")}
          /> 

          <h4 className="text-2xl font-medium mb-1">
            Email
          </h4>
          <input 
            type="email" 
            name="email"
            className="bg-zinc-800 w-1/3 p-2 mb-4 border-none rounded-md"
            placeholder={userData.email}
            {...register("email")}
          />

          <h4 className="text-2xl font-medium mb-1">
            Password
          </h4>
          <input 
            type="password"
            name="password"
            className="bg-zinc-800 w-1/3 p-2 mb-4 border-none rounded-md"
            placeholder="Change password?" 
            {...register("password")}
          />

          <h4 className="text-base font-medium mb-2">
            Enter your password to be able to make changes
          </h4>
          <input 
            type="password"
            name="confirm-password"
            placeholder="Password"
            className="bg-zinc-800 w-1/3 p-2 mb-4 border-none rounded-md"
            {...register("confirmPassword", { required: true })}
          />
          {errors.confirmPassword && <p>Password is required!</p>}
          <br />

          <button 
            type="submit"
            className="bg-green-500 rounded-md font-bold w-1/3 p-2 hover:bg-green-600"
          >
            Save profile changes
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}