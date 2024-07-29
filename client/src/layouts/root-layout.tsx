
import { Outlet, useNavigate, Navigate } from "react-router-dom";
import NewNavbar from "../components/Navbar/NewNavbar";
import Groups from "../components/Groups/Groups";
import { groups } from "../data/Groups";
import Bottom from "../components/Navbar/BottomBar";
import logo from "../assets/temp_logo.png";
//import SignIn from "../components/Auth/SignIn";// Import our new AuthProvider and useAuth hook
import { useAuth } from '../hooks/useAuth';
import { AuthProvider } from '../context/AuthContext';
import SignInPage from '../pages/auth/SignInPage';

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

  if (!isLoaded) {
    return (
      <div className="flex justify-center align-middle items-center mt-[50vh]">
        <img className="opacity-70" src={logo} alt="" />
      </div>
    );
  }

  // If the user is logged in and tries to access the sign-in page, redirect them to the home page
  if (user && window.location.pathname === '/signin') {
    return <Navigate to="/" replace />;
  }

  if(user && window.location.pathname === '/signup') {
    return <Navigate to="/" replace />;
  }

  if(!user && window.location.pathname === '/onboard') {
    return <Navigate to="/signin" replace />;
  }



  return user ? <AuthenticatedLayout /> : <SignInPage/>;
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
  return (
    <AuthWrappedApp />
  );
}

