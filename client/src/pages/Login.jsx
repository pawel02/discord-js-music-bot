import React from 'react'
import { Card } from '../components/container/Card'

export const Login = () => {
  return <Card>
    <h2>Login</h2>
    <section>
    <p>Bitte wähle eine Methode zum anmelden</p>
    <a href={process.env.REACT_APP_OAUTH_DISCORD_URL}><button className='primary'>Login with Discord</button></a>
    </section>
  </Card>
}
