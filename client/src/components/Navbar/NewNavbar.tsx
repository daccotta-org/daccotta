import React from 'react'
import { IoHome } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
const NewNavbar = () => {
  return (
    <div  className='flex flex-col gap-2 h-full w-full items-center p-2'>
        <button className='tooltip tooltip-right' data-tip="home"><IoHome size="36px" /></button>
        <button className='tooltip tooltip-right' data-tip="search"><IoSearch size="36px"/></button>
        <button className='tooltip tooltip-right' data-tip="friends"><FaUserFriends size="36px"/></button>
    </div>
  )
}

export default NewNavbar