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
        toast.error(
          "Failed to load your account data!", 
          {theme: "dark"}
        )
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

      toast.success("Profile updated!", {theme: "dark"})
    } catch(err) {
      if(err.response.status == 400){ 
        let requestErrors = err.response.data.error

        if(err.response.data.message)
          toast.warning(err.response.data.message, {theme: "dark"})
        
        if(requestErrors.name)
          toast.warning(
            `Invalid name: ${requestErrors.name[0]}`, 
            {theme: "dark"}
          )

        if(requestErrors.email)
          toast.warning(
            `Invalid email: ${requestErrors.email[0]}`, 
            {theme: "dark"}
          )

        if(requestErrors.password)
          toast.warning(
            `Invalid password: ${requestErrors.password[0]}`,
            {theme: "dark"}
          )
        
      } else
        toast.error(
          "Fail to update the profile!",
          {theme: "dark"}
        )
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
          className="flex flex-col gap-3 py-6 w-3/6"
        >
          <label className="input input-bordered flex items-center gap-2">
            Name
            <input 
              type="text" 
              name="name"
              placeholder={userData.name}
              className="grow"
              {...register("name")}
            /> 
          </label>

          <label className="input input-bordered flex items-center gap-2">
            Email
            <input 
              type="email" 
              name="email"
              className="grow"
              placeholder={userData.email}
              {...register("email")}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            Password
            <input 
              type="password"
              name="password"
              className="grow"
              placeholder="Change password?" 
              {...register("password")}
            />
          </label>

          <h4 className="mt-2">
            Enter your password to be able to make changes
          </h4>

          <label className="input input-bordered flex items-center gap-2">
            Password
            <input 
              type="password"
              name="confirm-password"
              placeholder="Password"
              className="grow"
              {...register("confirmPassword", { required: true })}
            />
            
          </label>
          {errors.confirmPassword && <p className="text-red-500">Password is required!</p>}

          <button 
            type="submit"
            className="btn btn-success text-xl mt-2"
          >
            Save profile changes
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}