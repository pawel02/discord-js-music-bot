import { configureStore} from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import { discordApi } from "../features/discord/discordSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [discordApi.reducerPath]: discordApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(discordApi.middleware)
    
})
