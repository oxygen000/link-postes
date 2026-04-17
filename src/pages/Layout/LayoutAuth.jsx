import React from 'react'
import { Outlet } from 'react-router-dom'
import useOnlineStatus from '../../hooks/useOnlineStatus'


export default function LayoutAuth() {
    const { isOnline, showBackOnline } = useOnlineStatus();
  
  return (
    <>

      const { isOnline, showBackOnline } = useOnlineStatus();
    
       {/* 🔴 Offline */}
      {!isOnline && (
        <div className="bg-red-600 text-white text-center py-2">
          ❌ No Internet Connection
        </div>
      )}

      {/* 🟢  Online */}
      {isOnline && showBackOnline && (
        <div className="bg-green-600 text-white text-center py-2">
          ✅ Connection Restored
        </div>
      )}
        <Outlet/>

    </>
  )
}
