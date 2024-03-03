import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SideBar from "./components/SideBar/SideBar";

export default function Layout(){
    return (
        <div>
            <Header />
            <div className='flex'>
                <SideBar />
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}