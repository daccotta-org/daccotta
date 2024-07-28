
import { IoHome } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { Link } from "react-router-dom";
const NewNavbar = () => {
  return (
    <div  className='flex flex-col gap-2 h-full w-full items-center p-2 justify-center '>
        <Link to="/"><button className='tooltip tooltip-right' data-tip="home"><IoHome size="36px" /></button></Link>
        <Link to="/search"><button className='tooltip tooltip-right' data-tip="search"><IoSearch size="36px"/></button></Link>
        <Link to="/friends"><button className='tooltip tooltip-right' data-tip="friends"><FaUserFriends size="36px"/></button></Link>
    </div>
  )
}

export default NewNavbar