import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'



export const ProtectedRoutes = () => {
    const authState = useSelector(store => store.auth)

    return authState.loggedIn ? <Outlet/> : <Navigate to={"/login"} />;
}
