import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { ApiKeyCard } from '@/components/settings/ApiKeyCard';
import { ThemeCard } from '@/components/settings/ThemeCard';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { UsageCard } from '@/components/settings/UsageCard';
import { Toaster } from '@/components/ui/Toaster';
import { UserProvider } from '@/components/UserProvider';
import Particles from '@/components/ui/particles';
import { ArrowLeft, House } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SettingsContent() {
  return (
    <UserProvider>
      <div className='relative min-h-screen overflow-hidden bg-bolt-elements-background-depth-2'>
        <div className='absolute inset-0 z-10 overflow-y-auto'>
          <div className='mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-8 flex items-center gap-4'>
              <a href='/' className='inline-flex' title='Back to Chat'>
                <ArrowLeft className='size-8' />
              </a>
              <h1 className='text-3xl font-bold text-content-primary'>Settings</h1>
            </div>

            <div className='space-y-6'>
              <ProfileCard />
              <ApiKeyCard />
              {/* <UsageCard /> */}
              {/* <ThemeCard /> */}
            </div>
          </div>
        </div>

        {/* This is the background image layer */}
        <div
          className='absolute inset-0 z-0 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: 'url(/background.png)' }}
        />

        {/* This is the particles layer */}
        <Particles size={0.2} quantity={80} className='absolute inset-0 z-0' />

        <Toaster />
      </div>
    </UserProvider>
  );
}
