

import { signOutAction } from '@/app/actions'
import React from 'react'
import { Button } from '../ui/button'

interface CustomStyleProps extends React.HTMLAttributes<HTMLFormElement> {
    customStyle?: string
}
export default function SignOutButton({ customStyle }: CustomStyleProps) {
    return (
        <form action={signOutAction} className="">
            <Button type="submit" variant={"outline"} className={`${customStyle}`}>
                Sign out
            </Button>
        </form>
    )
}
