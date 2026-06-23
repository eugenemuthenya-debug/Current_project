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
            if (error.response?.status=== 401  && !originalRequest._retry){
                originalRequest._retry= true
                console.log("Access token expired")

                // refresh logic
                try {
                    const refreshToken=localStorage.getItem("refresh_token")
                    const response=await axios.post("https://financial-backend-ps2l.onrender.com/api/refresh",
                        {},
                    { headers: {Authorization :`Bearer ${refreshToken}`}
                     })

                     const newAccessToken=response.data.access_token
                     localStorage.setItem("access_token",newAccessToken)

                      console.log("New Token received")
                      console.log(response.data)

                     originalRequest.headers.Authorization= `Bearer ${newAccessToken}`
                     return api(originalRequest)

                       
                    
                } catch (refreshError) {
                    console.log("Refresh failed")
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("refresh_token")
                    localStorage.removeItem("user")
                    window.location.href="/signin"
                    
                    return Promise.reject(refreshError)
                    
                }
            }
            return Promise.reject(error)
        }
        )
    
    

export default api;