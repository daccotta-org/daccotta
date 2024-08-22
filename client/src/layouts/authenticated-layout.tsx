// // AuthenticatedLayout.tsx
// import React from "react"
// import { Outlet } from "react-router-dom"
// import NewNavbar from "../components/custom/Navbar/NewNavbar"
// import Groups from "../components/custom/Groups/Groups"
// import Bottom from "../components/custom/Navbar/BottomBar"
// import { groups } from "../data/Groups"
// import "./layout.css"
// //bg-#1E201E

// const AuthenticatedLayout: React.FC = () => {
//     return (
//         <main className="flex h-screen w-full items-center justify-center bg-black pr-2 mx-0">
//             <div className="max-h-screen w-full flex flex-row text-neutral">
//                 <div className="flex flex-col h-screen nav ">
//                     <div className="mx-1 h-2/5 rounded-xl bg-bar">
//                         <NewNavbar />
//                     </div>

//                     <div className="mx-1 h-3/5  rounded-xl bg-bar">
//                         <Groups groups={groups} />
//                     </div>
//                     <div className="mx-1 h-1/5 rounded-xl bg-bar">
//                         <Bottom />
//                     </div>
//                 </div>
//                 <div className="w-full  rounded-3xl bg-main">
//                     <Outlet />
//                 </div>
//             </div>
//         </main>
//     )
// }

// export default AuthenticatedLayout
import React from "react"
import { Outlet } from "react-router-dom"
import NewNavbar from "../components/custom/Navbar/NewNavbar"
import Groups from "../components/custom/Groups/Groups"
import Bottom from "../components/custom/Navbar/BottomBar"
import { groups } from "../data/Groups"
import "./layout.css"
import { DockDemo } from "@/components/ui/DockBar"

const AuthenticatedLayout: React.FC = () => {
    return (
        <main className="flex h-screen w-full items-center justify-center bg-black pr-2 mx-0">
            <div className="max-h-screen w-full flex flex-row text-neutral h-full">
                {/* Sidebar (Navbar, Groups, Bottom) */}
                <div className=" flex-col h-full hidden lg:flex">
                    <div className="mx-1 h-2/5 rounded-xl bg-bar">
                        <NewNavbar />
                    </div>

                    <div className="mx-1 h-3/5 rounded-xl bg-bar">
                        <Groups groups={groups} />
                    </div>
                    <div className="mx-1 h-1/5 rounded-xl bg-bar">
                        <Bottom />
                    </div>
                </div>
                {/* Main Content */}
                <div className="w-full rounded-3xl bg-main flex-1 relative flex justify-center items-center">
                    <Outlet />
                    <div className="absolute z-5 block lg:hidden bottom-10 ">
                        <DockDemo />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AuthenticatedLayout
