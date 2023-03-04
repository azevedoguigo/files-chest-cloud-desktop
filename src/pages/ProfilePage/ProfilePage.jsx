import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Sidebar } from "../../components/sidebar/Sidebar";
import { api } from "../../services/api";

import "./ProfilePage.css"

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
    <div className="profile-page">
      <Sidebar />

      <div className="profile-manager">
        <h2>Account Details</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Profile Information</h3>
          <h4>Name</h4>
          <input 
            type="text" 
            name="name"
            defaultValue={userData.name}
            {...register("name")}
          /> 

          <h4>Email</h4>
          <input 
            type="email" 
            name="email"
            defaultValue={userData.email}
            {...register("email")}
          />

          <h4>Password</h4>
          <input 
            type="password"
            name="password"
            placeholder="Change password?" 
            {...register("password", { required: true })}
          />
          {errors.password && <p>Password is required!</p>}

          <h4 className="confirm-password">Enter your password to be able to make changes</h4>
          <input 
            type="password"
            name="confirm-password"
            placeholder="Password"
            {...register("confirmPassword", { required: true })}
          />
          {errors.confirmPassword && <p>Password is required!</p>}

          <button type="submit">Save profile changes</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}