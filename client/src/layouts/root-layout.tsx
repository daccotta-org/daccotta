import { Outlet, useNavigate } from "react-router-dom";
import { dark } from "@clerk/themes";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import NewNavbar from "../components/Navbar/NewNavbar";
import Groups from "../components/Groups/Groups";
import { groups } from "../data/Groups";
import Bottom from "../components/Navbar/BottomBar";
import logo from "../assets/temp_logo.png"
import SignIn from "../components/Auth/SignIn"; // You'll need to create this component


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function AuthenticatedLayout() {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-black pr-4 py-4">
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
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="flex justify-center align-middle items-center mt-[50vh]">
      <img className=" opacity-70" src={logo} alt="" />
    </div>;
  }

  return isSignedIn ? <AuthenticatedLayout /> : <SignIn />;
}

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "green",
          colorText: "white",
        },
      }}
    >
      <LayoutWrapper />
    </ClerkProvider>
  );
}
