import axios from 'axios'

const authEndpoint = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL + "/auth"
})

const login = async (loginKey) => {
    const response = await authEndpoint.post("/login", { code: loginKey })
    console.log(response.data)
    if (response.data) {
        localStorage.setItem('auth', JSON.stringify(response.data))
    }

    return response.data
}

const authService = {
    login
}

export default authService