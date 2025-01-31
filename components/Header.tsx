"use client";
import React from 'react'
import { ThemeSwitcher } from './theme-switcher'
import { GiLips } from 'react-icons/gi';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/app/actions';

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
//get user login status

export default function Header() {
    //render SignIn/SignUp button dynamically based on route
    const route = usePathname();
    return (
        <div className="sticky bg-black top-0 z-50 w-full">
            {/* Navigation Bar */}
            <div className="w-full border-b flex flex-row items-center h-16 px-8">
                <GiLips size={36} />
                {/* Left - App Title */}
                <div className="font-semibold text-4xl">
                    <a href={defaultUrl}>Pabulong
                    </a>
                </div>

                {/* Push ThemeSwitcher to the right */}
                <div className=" flex flex-row ml-auto gap-2">
                    {route === "/sign-in" ? (<Button className='text-sm bg-white text-black hover:bg-gray-300 dark:bg-white dark:text-black  dark:hover:bg-gray-200'>
                        <a href={"/sign-in"}>
                            Sign In
                        </a>
                    </Button>) :
                        (
                            route === "/sign-up" ? (<Button className='text-sm bg-white text-black hover:bg-gray-300 dark:bg-white dark:text-black  dark:hover:bg-gray-200'>
                                <a href={"/sign-up"}>
                                    Sign Up
                                </a>
                            </Button>) :
                                (
                                    <form action={signOutAction} className="items-centermt-4">
                                        <Button type="submit" variant="outline" className='text-sm bg-white text-black hover:bg-gray-300 dark:bg-white dark:text-black  dark:hover:bg-gray-200'>
                                            Sign out
                                        </Button>
                                    </form>
                                )
                        )
                    }
                    <ThemeSwitcher />
                </div>
            </div>
        </div>
    )
}
