import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_URL}/discord`,
    prepareHeaders: (header, {getState}) => {
        const token = getState().auth.token
        header.set("authorization", `Bearer ${token}`)
        console.log(header)
        return header
    },
})

export const baseApi = createApi({
    baseQuery,
    endpoints: () => ({}),
})