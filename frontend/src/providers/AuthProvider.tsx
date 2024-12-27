import { Loader } from 'lucide-react';
import { useState, useEffect } from 'react'
import { useAuth } from "@clerk/clerk-react";
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';

const updateApiToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
    else {
        delete axiosInstance.defaults.headers.common["Authorization"];
    }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { getToken, userId } = useAuth();
    const { checkAdminStatus } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const { initSocket, disconnectSocket } = useChatStore();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken();
                updateApiToken(token);
                if (token) {
                    checkAdminStatus()
                    // init socket
                    if(userId){
                        initSocket(userId);
                    }
                }

            } catch (error) {
                updateApiToken(null);
                console.log("Error in Auth Provider", error);

            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // cleanup

        return () => disconnectSocket();

    }, [getToken, initSocket, userId, checkAdminStatus, disconnectSocket]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader className='size-8 text-emerald-500 animate-spin' />
        </div>
    )
    return <>{children}</>
}
export default AuthProvider
