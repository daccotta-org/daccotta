import { Outlet, useNavigate } from 'react-router-dom'
import { dark } from '@clerk/themes';
import { ClerkProvider} from '@clerk/clerk-react'
import Navbar from '../components/Navbar/Navbar';
import NewNavbar from '../components/Navbar/NewNavbar';
import Groups from '../components/Groups/Groups';
import { IGroup } from '../Types/Group';
import { groups } from '../data/Groups';
import Login from '../components/Navbar/Login';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

export default function RootLayout() {
  const navigate = useNavigate();
  //user data extract krlio yaha pe

  return (
    <ClerkProvider
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "green",
          colorText: "white"
        }
      }}
    >
      <main className='flex  h-screen w-full items-center justify-center bg-black
       p-4' >
        <div className='grid  h-full w-full grid-cols-12 grid-rows-12 gap-2'>
          <div className='col-span-1 row-span-3 rounded-3xl bg-gradient text-white '><NewNavbar/></div>
          <div className='col-span-11 row-span-12 rounded-3xl text-white'>
             <Outlet />
          </div>
          <div className='col-span-1 row-span-7 rounded-3xl  bg-gradient text-white'>
            <Groups groups={groups}/></div>
          <div className='col-span-1 row-span-2 rounded-3xl  bg-gradient text-white'>
            <Login/>
          </div>
        </div>
      
     
      </main>
    </ClerkProvider>
  )
}
