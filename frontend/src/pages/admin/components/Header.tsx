import { UserButton } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'


const Header = () => {
  return (
    <div className='flex justify-between items-center'>
        <div className='flex items-center gap-3 mb-8'>
            <Link to="/" className='rounded-lg'>
                <img src="/spotify.png" alt="spotify-logo" className='size-10 object-cover' />
            </Link>
            <div>
                <h1 className='text-3xl font-bold'>Music Manager</h1>
                <p className='text-zinc-400 mt-1'>Manager your music catatlog</p>
            </div>
        </div>
        <UserButton />
    </div>
  )
}

export default Header
