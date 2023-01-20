import React from 'react'
import { Outlet } from 'react-router-dom'
import { GuildList } from '../components/GuildList'

export const Dashboard = () => {

  return (
    <div className='container'>
      <GuildList />
      <Outlet />
    </div>
  )
}
