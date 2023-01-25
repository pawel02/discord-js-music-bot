import { baseApi } from "../api"

export const discordApi = baseApi.injectEndpoints({
    reducerPath: "discord",
    endpoints: (builder) => ({
        getGuilds: builder.query({
            query: () => "/discord/guilds"
        })
    })
})

export const {
    useGetGuildsQuery
} = discordApi