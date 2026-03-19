import { useContext } from "react"
import { authContext } from "../../context/AuthContextProvider"
import { Navigate } from "react-router-dom"

export default function ProtectRoutes({children}) {

let {token} = useContext(authContext)


if(!token){
    return <Navigate to= "/login"/>
}

  return ( 
    <>
    {children}
    
    
    </>
  )
}
