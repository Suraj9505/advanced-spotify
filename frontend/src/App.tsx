import { Route, Routes } from "react-router-dom"
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage"
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'

import HomePage from "./pages/home/HomePage"
import MainLayout from "./layout/MainLayout"
import ChatPage from "./pages/chat/ChatPage"
import AlbumPage from "./pages/album/AlbumPage"
import AdminPage from "./pages/admin/AdminPage"
import PageNotFound from "./pages/extra/PageNotFound"
import ComingSoon from "./pages/extra/ComingSoon"


function App() {

    return (
        <>
            <Routes>
                <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />} />
                <Route path="/auth-callback" element={<AuthCallbackPage />} />

                <Route path="/admin" element={<AdminPage />} />

                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/album/:albumId" element={<AlbumPage />} />
                    <Route path="/playlists" element={<ComingSoon />} />
                    <Route path="/playlist/:playlistId" element={<ComingSoon />} />
                </Route>
                    <Route path="*" element={<PageNotFound />} />
            </Routes>

            <Toaster />
        </>
    )
}

export default App
