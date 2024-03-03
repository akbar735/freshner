import React from "react";
import { HashRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";

App.displayName = 'App';
export default function App(){
    return (
        <div className="bg-slate-100 dark:bg-gray-950 dark:text-white h-screen">
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                    </Route>
                </Routes>
            </HashRouter>
        </div>
    )
}