import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Player } from '../components/Player'
import { Queue } from '../components/Queue'
import { useGetPlayerQuery, useGetQueueQuery, useSetPausedMutation } from '../features/playerSlice'
import "./playerControll.css"

export const PlayerControll = () => {
  const { serverId } = useParams()
  const {token} = useSelector(state => state.auth)
  const {
    data: playerData,
    playerIsLoading,
    playerIsError,
  } = useGetPlayerQuery({serverId, token})

  const {
    queryisLoading,
    queryisError,
  } = useGetQueueQuery({serverId, token})

  

   if (queryisLoading || playerIsLoading) {
    <p>Loading...</p>
  } if (playerIsError || queryisError) {
    <div>
      <p>An error occured</p>
    </div>
  }else {
    return (
      <div className='player-controll-wrapper'>
        <Player serverId={serverId} />
        
        <Queue serverId={serverId}  />

      </div>
    )
  }
}
