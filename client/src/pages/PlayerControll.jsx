import React from 'react'
import { useParams } from 'react-router-dom'

export const PlayerControll = () => {
    const {serverId} = useParams()

  return (
    <div>
        {serverId}
    </div>
  )
}
