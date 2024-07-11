import React, { FC } from 'react'
import { RiSearch2Fill } from "react-icons/ri";
import { LuList } from "react-icons/lu";
import GetStarted from './GetStarted';
import { motion } from "framer-motion";
const Navbar:FC = () => {
  return (
    <div className="navbar bg-base-100 w-[100vw]">
    <div className="navbar-start">
      <div className="dropdown">
        <button className='btn btn-secondary'><LuList /></button>
        
      </div>
    </div>
  <div className="navbar-center">
    <a className="btn btn-ghost text-xl" href='/'>
      <span className='text-2xl font-bold'>dacc</span>
      <motion.button 
            initial={{ opacity: 0.6 }}
            whileHover={{
              scale: 1.6,
              transition: { duration: .2 },
            }}
            whileTap={{ scale: 0.9 }}
            whileInView={{ opacity: 1 }}
          > <RiSearch2Fill color='#fbdc6a'/>
      </motion.button>
     
      <span className='text-2xl font-bold'>tta</span>
    </a>
  </div>
  <div className="navbar-end ">
    <button className='btn btn-secondary'><GetStarted/></button>
   
 
    
  </div>
</div>
  )
}

export default Navbar