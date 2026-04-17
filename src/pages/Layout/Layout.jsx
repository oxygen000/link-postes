import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../../components/Nav/Nav'
import useOnlineStatus from '../../hooks/useOnlineStatus';

export default function Layout() {
  const { isOnline, showBackOnline } = useOnlineStatus();

  return (
    <div className='bg-bg dark:bg-bg-dark min-h-screen'>

    <div
  className={`overflow-hidden transition-all duration-500
  ${!isOnline || showBackOnline ? "max-h-20" : "max-h-0"}
  `}
>
  <div
    className={`w-full text-center py-2 font-semibold
    ${!isOnline ? "bg-red-600 text-white" : "bg-green-600 text-white"}
    `}
  >
    {!isOnline ? "❌ You are offline" : "✅ Back online"}
  </div>
</div>


      <Nav />
      <Outlet />
    </div>
  )
}