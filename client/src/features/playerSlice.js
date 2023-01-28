import { baseApi } from "./api";
import { io } from "socket.io-client"

const playerSlice = baseApi.injectEndpoints({
    reducerPath: "player",
    tagTypes: ["player", "queue"],
    endpoints: builder => ({
        getPlayer: builder.query({
            query: ({ serverId }) => `/player/${serverId}`,
            providesTags: ["player"],
            onCacheEntryAdded: async ({ serverId, token },
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
                await cacheDataLoaded
                const socket = io(`${process.env.REACT_APP_SERVER_URL}/player`, {
                    withCredentials: true,
                    auth: {
                        token,
                    }
                })
                try {

                    socket.on("connect", () => {
                        socket.emit("subscribe", { serverId })
                        socket.on("pausedChanged", (state, timestamp) => {
                            updateCachedData((draft) => {
                                draft.isPaused = state
                                draft.timestamp = timestamp
                            })
                        })
                        socket.on("trackStart", (track, timestamp, repeatMode) => {
                            updateCachedData((draft) => {
                                draft.current = track
                                draft.isPaused = false
                                draft.timestamp = timestamp
                                draft.repeatmode = repeatMode
                            })
                        })
                        socket.on("queueEnd", () => {
                            updateCachedData((draft) => {
                                draft.isPlaying = false
                                draft.current = null
                            })
                        })
                        socket.on("trackEnd", () => {
                            updateCachedData((draft) => {
                                draft.isPlaying = false
                            })
                        })
                    })
                } catch { }
                await cacheEntryRemoved
                socket.disconnect()
            }
        }),
        getQueue: builder.query({
            query: ({ serverId }) => `/player/${serverId}/queue`,
            providesTags: ["queue"],
            onCacheEntryAdded: async ({ serverId, token },
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
                await cacheDataLoaded
                const socket = io(`${process.env.REACT_APP_SERVER_URL}/player`, {
                    withCredentials: true,
                    auth: {
                        token,
                    }
                })
                try {

                    socket.on("connect", () => {
                        socket.emit("subscribe", { serverId })
                        socket.on("pausedChanged", state => {
                            updateCachedData((draft) => {
                                draft.isPaused = state
                            })
                        })
                        socket.on("tracksAdd", (tracks) => {
                            console.log("tracks added")
                            updateCachedData((draft) => {
                                draft.tracks = [...draft?.tracks || [], ...tracks]
                            })
                        })
                        socket.on("trackAdd", (track) => {
                            console.log("track added")
                            updateCachedData((draft) => {
                                draft.tracks = [...draft?.tracks || [], track]
                            })
                        })
                        socket.on("trackStart", () => {
                            console.log("track added")
                            updateCachedData((draft) => {
                                draft.tracks = draft.tracks.filter((t, index) => index !== 0)
                            })
                        })
                        socket.on("queueEnd", () => {
                            updateCachedData((draft) => {
                                draft.tracks = []
                            })
                        })
                    })
                } catch { }
                await cacheEntryRemoved
                socket.disconnect()
            }
        }),
        setPaused: builder.mutation({
            query: ({ serverId, state }) => ({
                url: `/player/${serverId}/setPaused`,
                method: "POST",
                body: { state }
            }),
            invalidatesTags: []
        }),
        skip: builder.mutation({
            query: ({ serverId }) => ({
                url: `/player/${serverId}/skip`,
                method: "POST"
            }),
            invalidatesTags: []
        }),
        addTrack: builder.mutation({
            query: ({ serverId, url }) => ({
                url: `/player/${serverId}/addTrack`,
                method: "PUT",
                body: { url }
            })
        })
    })
})


export const {
    useGetPlayerQuery,
    useGetQueueQuery,
    useSetPausedMutation,
    useSkipMutation,
    useAddTrackMutation,
} = playerSlice