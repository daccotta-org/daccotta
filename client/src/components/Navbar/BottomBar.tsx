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
    <div className="p-2 h-full w-full flex flex-col items-center justify-center gap-6">
      {isSignedIn ? (
        <div className="flex flex-col items-center gap-6">
          <FaUser 
            size={24} 
            className="text-white cursor-pointer"
            onClick={() => {/* Add user profile action here */}}
          />
          <FiLogOut
            size={24}
            className="text-white cursor-pointer"
            onClick={handleSignOut}
          />
        </div>
      ) : (
        <Link to="/signin">
          <IoLogInOutline 
            size={24} 
            className="text-white cursor-pointer"
          />
        </Link>
      )}
      <ThemeController />
    </div>
  );
};

export default Bottom;