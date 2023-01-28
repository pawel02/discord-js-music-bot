import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/container/Card'
import { login } from '../features/auth/authSlice'
import { useQuery } from '../hooks/useQuery'

export const Redirect = () => {
    const authState = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const query = useQuery()
    const navigate = useNavigate()

    const code = query.get("code")
    useEffect(() => {
        dispatch(login(code)).then(({error}) => {
            if(!error){
                navigate("/")
            }
    })
    }, [code])
    
    const Content = () => {
        if(authState.pending){
            return (<h3>loading...</h3>)
        }else if(authState.failed){
            return (<>
            <h3>An error occured</h3>
            <p>{authState.message}</p>
            <a href={process.env.REACT_APP_OAUTH_DISCORD_URL}><p>Retry</p></a> 
            </>)
        }
    }

    return (
    <Card>
        <Content />
    </Card>
  )
}
