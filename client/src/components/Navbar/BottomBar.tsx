import { FC } from "react";
import { IoLogInOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import ThemeController from "./ThemeController";
import { Link } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";

const Bottom: FC = () => {
  const { isSignedIn, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      // You can add post-logout actions here, like redirecting to home page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (

    
    <div className="p-2 h-100 w-full flex flex-col items-center justify-between  gap-2">
      {isSignedIn ? (
        <div className="flex flex-col items-center gap-6">
          <Link to="/profile">
          <button className="tooltip tooltip-right" data-tip="profile">
          <FaUser 
            size="1.5rem" 
            className="text-white cursor-pointer"
          />
          </button>
          </Link>
          <button className="tooltip tooltip-right" data-tip="logout">
          <FiLogOut
            size="1.5rem"
            className="text-white cursor-pointer"
            onClick={handleSignOut}
          />
          </button>
        </div>
      ) : (
        <Link to="/signin">
          <IoLogInOutline 
            size="1.5rem" 
            className="text-white cursor-pointer"
          />
        </Link>
      )}
      <ThemeController /> 
    </div>
     

  );
};

export default Bottom;