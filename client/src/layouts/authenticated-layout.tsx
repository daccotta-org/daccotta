import React from "react"
import { Outlet } from "react-router-dom"
import TopNavbar from "@/components/custom/Navbar/TopNavbar"
import Groups from "../components/custom/Groups/Groups"
import { groups } from "../data/Groups"
import "./layout.css"
import { DockDemo } from "@/components/ui/DockBar"

const AuthenticatedLayout: React.FC = () => {
    return (
        <main className="flex h-screen w-full items-center justify-start lg:justify-center bg-black pr-2 mx-0">
            <div className="max-h-screen w-full flex flex-row text-neutral h-full lg:my-4">
                {/* Sidebar (Navbar, Groups, Bottom) */}
                <div className=" flex-col h-full hidden lg:flex gap-4">
                    <div className="mx-1 h-[40vh] rounded-xl bg-background-light mt-2 border-[0.1rem] ">
                        <TopNavbar />
                    </div>

                    <div className="mx-1 h-[60vh] rounded-xl bg-background-light my-4 border-[0.1rem]">
                        <Groups groups={groups} />
                    </div>
                    {/* <div className="mx-1 h-1/5 rounded-xl bg-bar">
                        <Bottom />
                    </div> */}
                </div>
                {/* Main Content */}
                <div className="w-[90vw] lg:rounded-3xl bg-background flex-1 relative flex justify-center items-center">
                    <Outlet />
                    <div className="absolute z-50 block lg:hidden bottom-10">
                        <DockDemo />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AuthenticatedLayout
