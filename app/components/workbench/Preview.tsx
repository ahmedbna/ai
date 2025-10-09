import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { IconButton } from '@/components/ui/IconButton';
import { workbenchStore } from '@/lib/stores/workbench.client';
import { PortDropdown } from './PortDropdown';
import { Spinner } from '@ui/Spinner';
import { UpdateIcon, MobileIcon, ExternalLinkIcon, CrossCircledIcon, ImageIcon } from '@radix-ui/react-icons';
import * as Sentry from '@sentry/remix';
import * as Dialog from '@radix-ui/react-dialog';
import { ThumbnailChooser } from './ThumbnailChooser';

type ResizeSide = 'left' | 'right' | null;

export const Preview = memo(function Preview({ showClose, onClose }: { showClose: boolean; onClose: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [isPortDropdownOpen, setIsPortDropdownOpen] = useState(false);
  const hasSelectedPreview = useRef(false);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];
  const isActivePreviewSet = activePreview !== undefined;

  const [proxyBaseUrl, setProxyUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProxyUrl(null);
    setIsLoading(true);

    if (!isActivePreviewSet) {
      return undefined;
    }

    let hasUnmounted = false;
    let proxyPort: number | null = null;

    (async () => {
      const { proxyUrl, proxyPort: _proxyPort } = await workbenchStore.startProxy(activePreview.port);
      proxyPort = _proxyPort;
      setProxyUrl(proxyUrl);

      if (hasUnmounted) {
        workbenchStore.stopProxy(proxyPort);
      }
    })();

    return () => {
      hasUnmounted = true;
      if (proxyPort !== null) {
        workbenchStore.stopProxy(proxyPort);
      }
    };
  }, [isActivePreviewSet, activePreview?.port]);

  const [url, setUrl] = useState<string | undefined>();
  const [iframeUrl, setIframeUrl] = useState<string | undefined>();
  const [isDeviceModeOn, setIsDeviceModeOn] = useState(false);
  const [widthPercent, setWidthPercent] = useState<number>(37.5);

  const resizingState = useRef({
    isResizing: false,
    side: null as ResizeSide,
    startX: 0,
    startWidthPercent: 37.5,
    windowWidth: window.innerWidth,
  });

  const SCALING_FACTOR = 2;

  useEffect(() => {
    if (!proxyBaseUrl) {
      setUrl(undefined);
      setIframeUrl(undefined);
      return;
    }

    setUrl('/');
    if (proxyBaseUrl.endsWith('/')) {
      Sentry.captureMessage('proxyBaseUrl unexpectedly has a trailing slash');
    }
    setIframeUrl(proxyBaseUrl + '/');
  }, [proxyBaseUrl]);

  const findMinPortIndex = useCallback(
    (minIndex: number, preview: { port: number }, index: number, array: { port: number }[]) => {
      return preview.port < array[minIndex].port ? index : minIndex;
    },
    [],
  );

  useEffect(() => {
    if (previews.length > 1 && !hasSelectedPreview.current) {
      const minPortIndex = previews.reduce(findMinPortIndex, 0);
      setActivePreviewIndex(minPortIndex);
    }
  }, [previews, findMinPortIndex]);

  const reloadPreview = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const toggleDeviceMode = () => {
    setIsDeviceModeOn((prev) => !prev);
  };

  const [isThumbnailModalOpen, setIsModalOpen] = useState(false);
  const requestScreenshot = useCallback(() => {
    return workbenchStore.requestScreenshot(activePreviewIndex);
  }, [activePreviewIndex]);

  const startResizing = (e: React.MouseEvent, side: ResizeSide) => {
    if (!isDeviceModeOn) return;

    document.body.style.userSelect = 'none';
    resizingState.current.isResizing = true;
    resizingState.current.side = side;
    resizingState.current.startX = e.clientX;
    resizingState.current.startWidthPercent = widthPercent;
    resizingState.current.windowWidth = window.innerWidth;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!resizingState.current.isResizing) return;

    const dx = e.clientX - resizingState.current.startX;
    const windowWidth = resizingState.current.windowWidth;
    const dxPercent = (dx / windowWidth) * 100 * SCALING_FACTOR;

    let newWidthPercent = resizingState.current.startWidthPercent;

    if (resizingState.current.side === 'right') {
      newWidthPercent = resizingState.current.startWidthPercent + dxPercent;
    } else if (resizingState.current.side === 'left') {
      newWidthPercent = resizingState.current.startWidthPercent - dxPercent;
    }

    newWidthPercent = Math.max(10, Math.min(newWidthPercent, 90));
    setWidthPercent(newWidthPercent);
  };

  const onMouseUp = () => {
    resizingState.current.isResizing = false;
    resizingState.current.side = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.body.style.userSelect = '';
  };

  const GripIcon = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          color: 'rgba(0,0,0,0.5)',
          fontSize: '10px',
          lineHeight: '5px',
          userSelect: 'none',
          marginLeft: '1px',
        }}
      >
        ••• •••
      </div>
    </div>
  );

  const openInNewWindow = async () => {
    if (!proxyBaseUrl) {
      throw new Error('Proxy not loaded');
    }

    const { proxyUrl: newWindowProxyUrl } = await workbenchStore.startProxy(activePreview.port);
    const match = newWindowProxyUrl.match(/^https?:\/\/([^.]+)\.local-credentialless\.webcontainer-api\.io/);

    if (!match) {
      console.warn('[Preview] Invalid WebContainer URL:', proxyBaseUrl);
      return;
    }

    const previewId = match[1];
    const previewUrl = `/webcontainer/preview/${previewId}`;
    const newWindow = window.open(
      previewUrl,
      '_blank',
      `noopener,noreferrer,menubar=no,toolbar=no,location=no,status=no`,
    );

    if (newWindow) {
      newWindow.focus();
    }
  };

  const setIframeRefCallback = useCallback(
    (node: HTMLIFrameElement | null) => {
      iframeRef.current = node;
      workbenchStore.setPreviewIframe(activePreviewIndex, node);
    },
    [activePreviewIndex],
  );

  // Handle iframe load event
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <div ref={containerRef} className='relative flex size-full flex-col'>
      {isPortDropdownOpen && (
        <div className='z-iframe-overlay absolute size-full' onClick={() => setIsPortDropdownOpen(false)} />
      )}
      <div className='flex items-center gap-2 bg-bolt-elements-background-depth-2 p-2'>
        <div className='flex items-center gap-2'>
          <IconButton icon={<UpdateIcon />} onClick={reloadPreview} disabled={isLoading} />
        </div>

        <div className='focus-within:border-border-selected flex grow items-center gap-1 rounded-full border bg-bolt-elements-preview-addressBar-background px-3 py-1 text-sm text-bolt-elements-preview-addressBar-text focus-within:bg-bolt-elements-preview-addressBar-backgroundActive focus-within:text-bolt-elements-preview-addressBar-textActive hover:bg-bolt-elements-preview-addressBar-backgroundHover hover:focus-within:bg-bolt-elements-preview-addressBar-backgroundActive'>
          <input
            title='URL'
            ref={inputRef}
            className='w-full bg-transparent outline-none focus:outline-none'
            type='text'
            value={url || ''}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (proxyBaseUrl === null || iframeUrl === undefined) return;
              if (event.key !== 'Enter') return;

              if (url?.startsWith('http://') || url?.startsWith('https://')) {
                setUrl(iframeUrl.slice(proxyBaseUrl.length));
                inputRef.current?.blur();
                return;
              }

              const urlWithLeadingSlash = url?.startsWith('/') ? url : `/${url ?? ''}`;
              setUrl(urlWithLeadingSlash);
              setIframeUrl(proxyBaseUrl + urlWithLeadingSlash);
              setIsLoading(true);
              inputRef.current?.blur();
            }}
            disabled={proxyBaseUrl === null || isLoading}
          />
        </div>

        <div className='flex items-center gap-2'>
          {previews.length > 1 && (
            <PortDropdown
              activePreviewIndex={activePreviewIndex}
              setActivePreviewIndex={setActivePreviewIndex}
              isDropdownOpen={isPortDropdownOpen}
              setHasSelectedPreview={(value) => (hasSelectedPreview.current = value)}
              setIsDropdownOpen={setIsPortDropdownOpen}
              previews={previews}
            />
          )}

          <Dialog.Root open={isThumbnailModalOpen} onOpenChange={setIsModalOpen}>
            <Dialog.Trigger asChild>
              <IconButton icon={<ImageIcon />} title='View Preview Image' />
            </Dialog.Trigger>
            <ThumbnailChooser
              isOpen={isThumbnailModalOpen}
              onOpenChange={setIsModalOpen}
              onRequestCapture={requestScreenshot}
            />
          </Dialog.Root>

          <IconButton
            icon={<MobileIcon />}
            onClick={toggleDeviceMode}
            title={isDeviceModeOn ? 'Switch to Responsive Mode' : 'Switch to Device Mode'}
          />

          <div className='relative flex items-center'>
            <IconButton icon={<ExternalLinkIcon />} onClick={openInNewWindow} title='Open in New Window' />
          </div>

          {showClose && <IconButton icon={<CrossCircledIcon />} onClick={onClose} title='Close' />}
        </div>
      </div>

      <div className='flex flex-1 items-center justify-center overflow-auto border-t'>
        <div
          style={{
            width: isDeviceModeOn ? `${widthPercent}%` : '100%',
            height: '100%',
            overflow: 'visible',
            background: 'var(--bolt-elements-background-depth-1)',
            position: 'relative',
            display: 'flex',
          }}
        >
          {activePreview ? (
            proxyBaseUrl ? (
              <>
                {isLoading && (
                  <div className='absolute inset-0 flex items-center justify-center bg-bolt-elements-background-depth-1 z-10'>
                    <Spinner />
                  </div>
                )}
                <iframe
                  ref={setIframeRefCallback}
                  title='preview'
                  className='size-full border-none bg-bolt-elements-background-depth-1'
                  src={iframeUrl}
                  onLoad={handleIframeLoad}
                  sandbox='allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts'
                  allow='accelerometer; ambient-light-sensor; autoplay; bluetooth; camera; clipboard-write; compute-pressure; display-capture; fullscreen; gamepad; geolocation; gyroscope; hid; identity-credentials-get; idle-detection; local-fonts; magnetometer; microphone; midi; otp-credentials; payment; picture-in-picture; publickey-credentials-create; publickey-credentials-get; screen-wake-lock; serial; speaker-selection; usb; web-share; window-management; xr-spatial-tracking'
                  allowFullScreen={true}
                  loading='lazy'
                  style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.2s' }}
                />
              </>
            ) : (
              <div className='flex size-full items-center justify-center bg-bolt-elements-background-depth-1 text-content-primary'>
                <div>
                  <Spinner />
                </div>
              </div>
            )
          ) : (
            <div className='flex size-full items-center justify-center bg-bolt-elements-background-depth-1 text-content-primary'>
              No preview available
            </div>
          )}

          {isDeviceModeOn && (
            <>
              <div
                onMouseDown={(e) => startResizing(e, 'left')}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '15px',
                  marginLeft: '-15px',
                  height: '100%',
                  cursor: 'ew-resize',
                  background: 'rgba(255,255,255,.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  userSelect: 'none',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.5)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.2)')}
                title='Drag to resize width'
              >
                <GripIcon />
              </div>

              <div
                onMouseDown={(e) => startResizing(e, 'right')}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '15px',
                  marginRight: '-15px',
                  height: '100%',
                  cursor: 'ew-resize',
                  background: 'rgba(255,255,255,.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  userSelect: 'none',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.5)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.2)')}
                title='Drag to resize width'
              >
                <GripIcon />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
