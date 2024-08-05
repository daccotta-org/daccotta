import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import logo from "../assets/logo_light.png";
import Groups from "../components/Groups/Groups";
import Bottom from "../components/Navbar/BottomBar";
import NewNavbar from "../components/Navbar/NewNavbar";
import { groups } from "../data/Groups";
//import SignIn from "../components/Auth/SignIn";// Import our new AuthProvider and useAuth hook
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import SignUp from "../pages/auth/SignUpPage";
import { checkOnboardedStatus } from "../services/userService";
import SignInPage from "../pages/auth/SignInPage";



function AuthenticatedLayout() {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-black pr-4 py-2">
      <div className=" grid h-full w-full grid-cols-12 grid-rows-12 gap-2 text-neutral ">
        <div className="mx-3 col-span-1 row-span-3 rounded-xl bg-gradient-to-tr from-primary to-secondary ">
          <NewNavbar />
        </div>
        <div className="col-span-11 row-span-12 bg-gradient-to-r from-primary to-secondary rounded-3xl ">
          <Outlet />
        </div>
        <div className="mx-3 col-span-1 row-span-6 rounded-xl bg-gradient-to-tr from-primary to-secondary ">
          <Groups groups={groups} />
        </div>
        <div className="mx-3 col-span-1 row-span-3 rounded-xl bg-gradient-to-tr from-primary to-secondary ">
          <Bottom />
        </div>
      </div>
    </main>
  );
}

function LayoutWrapper() {
  const { isLoaded, user } = useAuth();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);


   // Fetch onboarded status
  useEffect(() => {
    const fetchOnboardedStatus = async () => {
      if (user) {
        try {
          const onboardedStatus = await checkOnboardedStatus(user.uid);
          setIsOnboarded(onboardedStatus);
        } catch (error) {
          console.error("Failed to fetch onboarded status:", error);
        }
      } else {
        setIsOnboarded(null); // Reset onboarding status if no user
      }
    };

    fetchOnboardedStatus();
  }, [user]);

  if( user && isOnboarded === null){
     // Show loading state while checking onboarding status
     return (
      <div className="flex flex-col h-[100vh] justify-center items-center  ">
        <img className="opacity-80" src={logo} alt="" width="100px" />
      </div>
    );
  }

  if (!isLoaded) {
    // Show loading state while checking onboarding status
    return (
      <div className="flex flex-col h-[100vh] justify-center items-center  ">
        <img className="opacity-80" src={logo} alt="" width="100px" />
      </div>
    );
  }

  //If the user is logged in and tries to access the sign-in page, redirect them to the home page
  if (user && window.location.pathname === "/signin") {
    return <Navigate to="/" replace />;
  }

  if (user && window.location.pathname === "/signup") {
    return <Navigate to="/" replace />;
  }

  if(!user && window.location.pathname === "/"){
    return <Navigate to="/signup" replace />;
  }
  if (isOnboarded) {
    // If onboarded, redirect to the profile page
    if (window.location.pathname === "/signup" || window.location.pathname === "/onboard") {
      return <Navigate to="/profile" replace />;
    }
  } else {
    // If not onboarded, redirect to the onboarding page
    if (window.location.pathname !== "/onboard") {
      return <Navigate to="/onboard" replace />;
    }
  }

  // if (!user && window.location.pathname === '/onboard') {
  //   return <Navigate to="/signin" replace />;
  // }

  // if (user && onboardedStatus && !onboardedStatus.onboarded && window.location.pathname !== '/onboard') {
  //   return <Navigate to="/onboard" replace />;
  // }

  return user ? <AuthenticatedLayout /> : <SignUp/>;
}

function AuthWrappedApp() {
  const navigate = useNavigate();

  return (
    <AuthProvider navigate={navigate}>
      <LayoutWrapper />
    </AuthProvider>
  );
}

export default function RootLayout() {
  return <AuthWrappedApp />;
}
