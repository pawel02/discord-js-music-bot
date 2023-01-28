import { useSelector } from 'react-redux'
import { useAddTrackMutation, useGetQueueQuery } from '../features/playerSlice'
import React from 'react'
import "./queue.css"
import { Card } from './container/Card'

export const Queue = ({ serverId }) => {

    const { token } = useSelector(state => state.auth)
    const {
        data: queryData,
    } = useGetQueueQuery({ serverId, token })

    const [addTrack, { isLoading: isTrackAdding, error: addTrackError }] = useAddTrackMutation()
    const handleSubmit = async (e) => {
        e.preventDefault()
        await addTrack({ serverId, url: e.target.elements.url.value })
        e.target.elements.url.value = ""
    }
    return (
        <div className='queue'>
            <div className='add-track'>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='url'>Add a song to the queue</label>
                    <input disabled={isTrackAdding} name="url" type={"url"} placeholder="youtube song url" />
                    {addTrackError?.data !== "OK" && <p className='error'>{addTrackError?.data?.error || addTrackError?.status}</p>}
                </form>
            </div>
            <ul>
                {queryData?.tracks?.map((track, index) => {
                    return (
                        <li key={index}>
                            <div className='track'>
                                <img src={track.thumbnail} />
                                <div className='text'>
                                    <p className='title'>{track.title}</p>
                                    <label>- {track.author}</label>
                                </div>
                            </div>
                        </li>)
                })}
            </ul>
        </div>
    )
}
