"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "postcss";

interface CustomStyleProps extends React.HTMLAttributes<HTMLButtonElement> {
    customStyle?: string
}

export default function DeleteAccountButton() {
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState(true);

    const dummyHandleDeleteAccount = async () => {
        console.log("ACCOUNT DELETED");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger Button */}
            <DialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>

            {/* Modal Content */}
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove all your data.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 justify-center items-center">
                    <input type="checkbox" onChange={() => setChecked(!checked)} />
                    <p>I agree</p>
                </div>
                {/* Footer Buttons */}
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button disabled={checked} variant="destructive" onClick={dummyHandleDeleteAccount}>
                        Yes, Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
