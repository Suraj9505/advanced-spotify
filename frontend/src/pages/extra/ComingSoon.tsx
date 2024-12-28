import { Music2 } from "lucide-react"

const ComingSoon = () => {
  return (
    <div className='h-full bg-neutral-900 flex flex-col items-center justify-center'>
			<div className='space-y-8'>
				{/* Large animated musical note */}
				<div className='flex justify-center animate-bounce'>
					<Music2 className='h-24 w-24 text-emerald-500' />
				</div>

				{/* Error message */}
				<div className='space-y-4'>
					<h1 className='text-7xl font-bold text-white'>Coming Soon!!!!</h1>
					<p className='text-neutral-400 max-w-md mx-auto'>
						Looks like you are too early. This page is still in the works.
					</p>
                    <p className="text-center text-2xl">Please check back later 😊.</p>
				</div>
			</div>
		</div>
  )
}

export default ComingSoon
