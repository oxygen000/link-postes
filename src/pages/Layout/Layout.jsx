import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../../components/Nav/Nav'
import useOnlineStatus from '../../hooks/useOnlineStatus'

export default function Layout() {
  const { isOnline, showBackOnline } = useOnlineStatus();

  return (
    <div className='bg-bg dark:bg-bg-dark min-h-screen'>

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


      <Nav />
      <Outlet />
    </div>
  )
}