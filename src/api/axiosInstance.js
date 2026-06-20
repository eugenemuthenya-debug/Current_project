import axios from "axios";

const api = axios.create({
    baseURL:"https://financial-backend-ps2l.onrender.com/api",})

    api.interceptors.request.use(
        (config)=>{
            const accessToken=
            localStorage.getItem("access_token")

            if (accessToken){
                config.headers.Authorization=
                `Bearer ${accessToken}`
            }
            return config
        }
    )

export default api