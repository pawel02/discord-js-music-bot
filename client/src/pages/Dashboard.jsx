import React from 'react'
import { Outlet } from 'react-router-dom'
import { Wrapper } from '../components/container/Wrapper'
import { GuildList } from '../components/GuildList'

export const Dashboard = () => {

  return (
    <div className='container'>
      <Wrapper variant="container">
        <GuildList />
      </Wrapper>
      <Wrapper variant="container">
        <Outlet />
      </Wrapper>
    </div>
  )
}
