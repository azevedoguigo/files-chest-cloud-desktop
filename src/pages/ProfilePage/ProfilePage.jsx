import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { api } from "../../services/api";

import "./ProfilePage.css"

export function ProfilePage() {
  const [userData, setUserData] = useState({})

  const token = localStorage.getItem("token") 

  useEffect(() => {
    if(token === null) window.location.href = "/sign-in"
    
    async function loadUserData() {
      const response = await api.get("/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      setUserData(response.data.user)
    }

    loadUserData()
  }, [])
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  async function onSubmit(data) {
    let updatedParams = {
      name: data.name,
      email: data.email,
      password: data.password
    }

    await api.put("/users", updatedParams, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
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
          />

          <h4 className="confirm-password">Enter your password to be able to make changes</h4>
          <input 
            type="password"
            name="confirm-password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && <p>Password is required!</p>}

          <button type="submit">Save profile changes</button>
        </form>
      </div>
    </div>
  )
}