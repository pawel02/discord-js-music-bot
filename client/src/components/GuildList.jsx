import React from 'react'
import { useEffect } from 'react'
import { useGetGuildsQuery } from '../features/discord/discordSlice'
import { logout } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import "./GuildList.css"
import { Link } from 'react-router-dom'
const GuildItem = ({guild}) => (
    <Link to={`/${guild.id}`}>
    <li>
        <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} />
    </li>
    </Link>
)

export const GuildList = () => {
    const dispatch = useDispatch()
    const {
        data: guilds,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetGuildsQuery()
    
    useEffect(() => {
        if(error?.originalStatus === 401) dispatch(logout());

    }, [error, dispatch])

    console.log(guilds)

    if(isLoading){
        return <p>is loading ...</p>
    } else if(isSuccess){
        return (<ul className='guild-list'>
            {guilds.map(g => <GuildItem guild={g} />)}
        </ul>)
    } else if(isError){
        return <div>
            <h1>an Error occured</h1>
            <p>{error.message}</p>
            </div>
    }
}
