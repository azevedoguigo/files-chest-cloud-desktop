import axios from "axios"

export const api = axios.create({
  baseURL: "https://files-chest-cloud-api.gigalixirapp.com/api/",
})