import { Spinner } from '@/components/ui/spinner';
import Particles from './ui/particles';

export function Loading(props: { message?: string }) {
  return (
    <div className='relative size-full overflow-hidden'>
      <div className='absolute inset-0 z-10 flex flex-col items-center  gap-4'>
        <div className='mx-auto mb-8 px-4 pt-36 text-center md:mt-16 lg:px-0'>
          <p className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl font-black leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-6xl'>
            BNA AI
          </p>

          <span className='pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-3xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10'>
            Idea to fullstack mobile app in seconds
          </span>
        </div>

        <Spinner />
        <p className='text-content-secondary'>{props.message ?? 'Loading...'}</p>
      </div>

      {/* This is the background image layer */}
      <div
        className='absolute inset-0 z-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: 'url(/background.png)' }}
      />

      {/* This is the particles layer */}
      <Particles size={0.2} quantity={80} className='absolute inset-0 z-0' />
    </div>
  );
}
