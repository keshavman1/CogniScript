import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';
import { toast } from "react-hot-toast"
const PrivateRoute = ({children}) => {
    const {token} = useSelector((state) => state.auth);
    if(token !== null){
       // toast.success(children);
        return children
    }
    else
        return <Navigate to="/login" />

}

export default PrivateRoute
