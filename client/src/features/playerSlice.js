import { baseApi } from "./api";
import { io } from "socket.io-client"
import { createEntityAdapter } from "@reduxjs/toolkit";

const playerSlice = baseApi.injectEndpoints({
    reducerPath: "player",
    tagTypes: ["player", "queue"],
    endpoints: builder => ({
        getPlayer: builder.query({
            query: ({ serverId }) => `/player/${serverId}`,
            providesTags: ["player"],
            onCacheEntryAdded: async ({ serverId, token },
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
                try {
                    await cacheDataLoaded
                    const socket = io(`http://localhost:3001/player`, {
                        withCredentials: true,
                        auth: {
                            token,
                        }
                    })

                    socket.on("connect", () => {
                        socket.emit("subscribe", { serverId })
                        socket.on("pausedChanged", state => {
                            updateCachedData((draft) => {
                                draft.isPaused = state
                            })
                        })
                        socket.on("trackAdd", (queue, track) => {
                            updateCachedData((draft) => {
                                draft.isPlaying = true
                            })
                        })
                        socket.on("trackStart", (queue, track, timestamp, repeatMode) => {
                            console.log("trackStart", queue, track)
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
                    })
                } catch { }
                await cacheEntryRemoved
                io.disconnect()
            }
        }),
        getQueue: builder.query({
            query: ({serverId}) => `/player/${serverId}/queue`,
            providesTags: ["queue"],
            onCacheEntryAdded: async ({ serverId, token },
                { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
                try {
                    await cacheDataLoaded
                    const socket = io(`http://localhost:3001/player`, {
                        withCredentials: true,
                        auth: {
                            token,
                        }
                    })

                    socket.on("connect", () => {
                        socket.emit("subscribe", { serverId })
                        socket.on("pausedChanged", state => {
                            updateCachedData((draft) => {
                                draft.isPaused = state
                            })
                        })
                        socket.on("trackAdd", (queue, track, tracks) => {
                            console.log("track added")
                            updateCachedData((draft) => {
                                draft.tracks = [...draft?.tracks || [], track]
                            })
                        })
                        socket.on("trackStart", (queue, track, timestamp, repeatMode, tracks) => {
                            console.log("track added")
                            updateCachedData((draft) => {
                                draft.tracks = tracks
                                draft.isPaused = false
                            })
                        })
                    })
                } catch { }
                await cacheEntryRemoved
                io.disconnect()
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
            query: ({serverId}) => ({
                url: `/player/${serverId}/skip`,
                method: "POST"
            }),
            invalidatesTags: []
        }),
        addTrack: builder.mutation({
            query: ({serverId, url}) => ({
                url: `/player/${serverId}/addTrack`,
                method: "PUT",
                body: {url}
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