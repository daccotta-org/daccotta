import React from "react"
import { Outlet } from "react-router-dom"

import "./layout.css"
import Navbar from "@/components/custom/Navbar/TestNavbar"
import { GlobalSearchProvider } from "@/context/GlobalSearchContext"
import GlobalSearch from "@/components/custom/GlobalSearch/GlobalSearch"

const AuthenticatedLayout: React.FC = () => {
    return (
        <GlobalSearchProvider>
            <main className="flex h-screen w-full items-center justify-start lg:justify-center bg-black pr-2 mx-0">
                <div className="max-h-screen w-full flex flex-row text-neutral h-full lg:my-4">
                    <div className=" flex-col h-full  lg:flex gap-4">
                        <Navbar />
                    </div>
                    <div className="w-[90vw] lg:rounded-3xl bg-background flex-1 relative flex justify-center  items-center">
                        <Outlet />
                    </div>
                </div>
            </main>
            <GlobalSearch />
        </GlobalSearchProvider>
    )
}

export default AuthenticatedLayout
