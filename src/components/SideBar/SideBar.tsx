import React from "react";
import { NavLink } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { MdOutlineAudioFile } from "react-icons/md";
import { MdOutlineTheaters } from "react-icons/md";
import { MdSettings } from "react-icons/md";
import { pagePath } from "../../contants/page";
SideBar.displayName = 'SideBar';

const pageLink = [
    {
        path: pagePath.HOME,
        label: 'Home',
        icon: MdHome
    },
    {
        path: pagePath.AUDIOGALLERY,
        label: 'Audio Gallery',
        icon: MdOutlineAudioFile
    },
    {
        path: pagePath.VIDEOGALLERY,
        label: 'Video Gallery',
        icon: MdOutlineTheaters
    }
]

const settingPage = [
    {
        path: pagePath.SETTINGS,
        label: 'Settings',
        icon: MdSettings
    }
]
export default function SideBar(){
 
    return (
        <div className="border-r border-slate-300 app-content-height">
            <div className="flex justify-between flex-col h-full w-200">
                <ul>
                    {pageLink.map(page => (
                        <NavLink to={page.path} key={page.label} className={({isActive}) => `${isActive ? 'bg-purple-700 dark:!bg-slate-700':'bg-slate-200'} ${isActive ? 'text-white': 'text-inherit'} dark:bg-slate-950 border-b border-slate-300 flex p-2`}>
                            {<page.icon className="h-6 w-6 block" />}
                            <p className="ml-2">{page.label}</p>
                        </NavLink>
                    ))}
                </ul>
                <ul>
                    {settingPage.map(page => (
                        <NavLink to={page.path} key={page.label} className={({isActive}) => `${isActive ? 'bg-purple-700 dark:!bg-slate-700':'bg-slate-200'} ${isActive ? 'text-white': 'text-inherit'} dark:bg-slate-950 border-b border-slate-300 flex p-2`}>
                            {<page.icon className="h-6 w-6 block" />}
                            <p className="ml-2">{page.label}</p>
                        </NavLink>
                    ))}
                </ul>
            </div>
        </div>
       
    )
}