import { FC } from 'react'
import { Link } from 'react-router-dom'
import { RiSearch2Fill } from "react-icons/ri";
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { LuList } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

import { motion } from "framer-motion";
const Navbar: FC = () => {
  return (
    <div className="navbar bg-base-100 w-[100vw] ">
    <div className="navbar-start">
      <div className="dropdown">
        <button className='btn btn-secondary'><LuList /></button>
        

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
          > <RiSearch2Fill color='#fbdc6a' />
          </motion.button>

          <span className='text-2xl font-bold'>tta</span>
        </a>
      </div>
      <div className="navbar-end ">
        <button className='btn btn-secondary bg-[#5e5d5d] border-0'>
          <SignedIn>
            <UserButton afterSignOutUrl='/' />
          </SignedIn>
          <SignedOut>
            <button><Link to={"/sign-up"}><CgProfile/></Link></button>
          </SignedOut>
        </button>



      </div>
    </div>
  </div>
  )
}

export default Navbar
