import React from 'react'
import { useEffect } from 'react'
import { useGetGuildsQuery } from '../features/discord/discordSlice'
import { logout } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import "./GuildList.css"
import { Link, Navigate } from 'react-router-dom'
const GuildItem = ({ guild }) => (
    <Link to={`/${guild.id}`}>
        <li>
            <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`} alt={`Server icon for ${guild.name}`} />
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
        if (error?.originalStatus === 401) dispatch(logout());

    }, [error, dispatch])

    if (isLoading) {
        return <p>is loading ...</p>
    } else if (isSuccess) {
        return (<ul className='guild-list'>
            {guilds.map(g => <GuildItem key={g.id} guild={g} />)}
        </ul>)
    } if (isError) {
        if(error?.originalStatus === 401){
            return <Navigate to={"/login"} />
        } else {
            return <div>
                <h1>an Error occured</h1>
                <p>{error.message}</p>
            </div>
        }
    }
}
