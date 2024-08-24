import { IoHome } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { Link } from "react-router-dom";
import  "../../../index.css";

const TopNavbar = () => {
  return (
    <div className="flex flex-col h-full w-full items-center p-2 justify-center gap-4 text-white">
      <Link to="/">
        <button className="tooltip tooltip-right flex flex-col items-center gap-1" data-tip="home">
          <IoHome size="1.4rem" />
          <div className="text-xs">Home</div>
        </button>
      </Link>
      <Link to="/">
        <button className="tooltip tooltip-right flex flex-col items-center gap-1" data-tip="search">
          <IoSearch size="1.4rem" />
          <div className="text-xs">Search</div>
        </button>
      </Link>
      <Link to="/friends">
        <button className="tooltip tooltip-right flex flex-col items-center gap-1" data-tip="friends">
          <FaUserFriends size="1.4rem" />
          <div className="text-xs">Friends</div>
        </button>
      </Link>
    </div>
  );
};

export default TopNavbar;