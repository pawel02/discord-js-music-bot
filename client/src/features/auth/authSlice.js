import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const { user, token } = JSON.parse(localStorage.getItem('auth')) || {}

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

const initialState = {
    user: user || null,
    token: token || null,
    loggedIn: user && token,
    loading: false,
    successfull: false,
    failed: false,
    message: "",
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state, action) => {
            console.log("log out triggered")
            localStorage.clear()
            return {
                ...initialState,
                user: null,
                token: null,
            }
        }

    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false
            state.successfull = true
            state.failed = false
            state.loggedIn = true
            state.user = action.payload.user
            state.token = action.payload.token
        })
        builder.addCase(login.pending, (state, action) => {
            state.loading = true
            state.successfull = false
            state.failed = false
        })
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false
            state.successfull = false
            state.failed = true
            state.message = action.payload
        })
    }
})

console.log(authSlice.actions)
export const { logout } = authSlice.actions


export default authSlice.reducer
