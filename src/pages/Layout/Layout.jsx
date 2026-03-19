import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../../components/Nav/Nav'
import Footer from '../../components/Footer/Footer'

export default function Layout() {
  return (
    <div className='bg-bg dark:bg-bg-dark'>
        <Nav/>
        <Outlet/>
    </div>
  )
}
