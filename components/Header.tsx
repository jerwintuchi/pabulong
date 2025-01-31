import React from 'react'
import { ThemeSwitcher } from './theme-switcher'
import { GiLips } from 'react-icons/gi';

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
7
export default function Header() {
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
                <div className="ml-auto">
                    <ThemeSwitcher />
                </div>
            </div>
        </div>
    )
}
