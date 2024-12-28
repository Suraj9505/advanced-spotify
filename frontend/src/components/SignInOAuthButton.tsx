import { useSignIn } from '@clerk/clerk-react';
import { Button } from './ui/button';
import { useChatStore } from '@/stores/useChatStore';

const SignInOAuthButton = () => {
    const { signIn, isLoaded } = useSignIn();
    const { disconnectSocket } = useChatStore();

    if(!isLoaded){
        return null;
    }

    const signInWithGoogle = () => {
        signIn.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sso-callback",
            redirectUrlComplete: "/auth-callback"
        })

        disconnectSocket();
    }

    return (
    <Button onClick={signInWithGoogle} variant={"secondary"} className='w-full text-white border-zinc-200 h-11 flex items-center justify-between'>
        <img src="/google.png" alt="Google" className="size-5" /> Sign In
    </Button>
  )
}

export default SignInOAuthButton
