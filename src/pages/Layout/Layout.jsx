import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../../components/Nav/Nav'

export default function Layout() {

  return (
    <div className='bg-bg dark:bg-bg-dark min-h-screen'>

     


      <Nav />
      <Outlet />
    </div>
  )
}