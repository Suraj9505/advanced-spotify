import { Link, useLocation } from "react-router-dom";
import { LayoutDashboardIcon } from "lucide-react";
import { SignedOut } from "@clerk/clerk-react";
import SignInOAuthButton from "./SignInOAuthButton";
import {  buttonVariants } from "./ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";

const Topbar = () => {
    const { isAdmin } = useAuthStore();
    const route = useLocation();
    return (
        <div className="flex items-center justify-between rounded-md p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
            <div className="flex gap-2 items-center">
                <img src="spotify.png" alt="spotify-logo" className="size-8 object-cover"/>
                <span>Spotify</span>
            </div>
            <div className="flex items-center gap-4">
                {isAdmin && (
                    <Link to={"/admin"} className={cn(buttonVariants(
                        {
                            className: `w-full bg-zinc-800 hover:bg-zinc-700 text-white justify-start ${route.pathname === "/admin-dashboard" ? "bg-emerald-600" : ""}`
                        }
                        ))}>
                        <LayoutDashboardIcon className="size-4 mr-2" />
                        Admin Dashboard
                    </Link>
                )}

                <SignedOut>
                    <SignInOAuthButton />
                </SignedOut>
                <UserButton />
            </div>
        </div>
    )
}

export default Topbar
