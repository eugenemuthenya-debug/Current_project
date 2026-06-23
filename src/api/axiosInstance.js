import axios from "axios";

const api = axios.create({
    baseURL:"https://financial-backend-ps2l.onrender.com/api",})

// request interceptor
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

// response interceptor
    api.interceptors.response.use(

        (response)=>{
            return response 
        },

        async (error)=>{

            const originalRequest=error.config
            if (error.response?.status=== 401){
                console.log("Access token expired")
                console.log(originalRequest)
            }
            return Promise.reject(error)
        }
        )
    
    

export default api;