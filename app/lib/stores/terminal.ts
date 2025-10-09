// app/lib/stores/terminal.ts

import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { atom, type WritableAtom } from 'nanostores';
import type { ITerminal, TerminalInitializationOptions } from '@/types/terminal';
import { newBoltShellProcess, newShellProcess } from '@/utils/shell';
import { coloredText } from '@/utils/terminal';
import { workbenchStore } from './workbench.client';
import {
  activeTerminalTabStore,
  CONVEX_DEPLOY_TAB_INDEX,
  isConvexDeployTerminalVisibleStore,
  VITE_TAB_INDEX,
} from './terminalTabs';
import { toast } from 'sonner';
import { ContainerBootState, waitForBootStepCompleted } from './containerBootState';

export class TerminalStore {
  #webcontainer: Promise<WebContainer>;
  #terminals: Array<{ terminal: ITerminal; process: WebContainerProcess }> = [];
  #boltTerminal = newBoltShellProcess();
  #deployTerminal = newBoltShellProcess();
  showTerminal: WritableAtom<boolean> = import.meta.hot?.data.showTerminal ?? atom(true);

  startDevServerOnAttach = false;
  #devServerProcess: WebContainerProcess | null = null;

  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.#webcontainer = webcontainerPromise;

    if (import.meta.hot) {
      import.meta.hot.data.showTerminal = this.showTerminal;
    }
  }

  get boltTerminal() {
    return this.#boltTerminal;
  }

  toggleTerminal(value?: boolean) {
    this.showTerminal.set(value !== undefined ? value : !this.showTerminal.get());
  }

  async attachBoltTerminal(terminal: ITerminal) {
    try {
      const wc = await this.#webcontainer;
      await this.#boltTerminal.init(wc, terminal);
    } catch (error: any) {
      console.error('Failed to initialize bolt terminal:', error);
      terminal.write(coloredText.red('Failed to spawn dev server shell\n\n') + error.message);
      return;
    }
  }

  async deployFunctionsAndRunDevServer(shouldDeployConvexFunctions: boolean) {
    if (shouldDeployConvexFunctions) {
      await waitForBootStepCompleted(ContainerBootState.STARTING_BACKUP);
      isConvexDeployTerminalVisibleStore.set(true);
      activeTerminalTabStore.set(CONVEX_DEPLOY_TAB_INDEX);

      await this.#deployTerminal.executeCommand('clear');
      const result = await this.#deployTerminal.executeCommand('convex dev --once');

      if (result.exitCode !== 0) {
        toast.error('Failed to deploy Convex functions. Check the terminal for more details.');
        workbenchStore.currentView.set('code');
        activeTerminalTabStore.set(CONVEX_DEPLOY_TAB_INDEX);
        return;
      } else {
        isConvexDeployTerminalVisibleStore.set(false);
        activeTerminalTabStore.set(VITE_TAB_INDEX);
        toast.success('Convex functions deployed successfully');
      }
    }

    // Start dev server with optimizations
    if (!workbenchStore.isDefaultPreviewRunning()) {
      await this.startOptimizedDevServer();
    }
  }

  async startOptimizedDevServer() {
    try {
      const wc = await this.#webcontainer;

      // Kill existing dev server if running
      if (this.#devServerProcess) {
        this.#devServerProcess.kill();
        this.#devServerProcess = null;
        // Wait a bit for the port to be freed
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Start with optimized flags for better performance
      const optimizedCommand = [
        'npx',
        'expo',
        'start',
        '--web',
        '--max-workers',
        '2', // Limit workers to reduce CPU usage
        '--reset-cache', // Clear cache for fresh start (only first time)
      ];

      this.#devServerProcess = await wc.spawn(optimizedCommand[0], optimizedCommand.slice(1), {
        env: {
          ...process.env,
          NODE_OPTIONS: '--max-old-space-size=4096',
          EXPO_USE_FAST_RESOLVER: '1',
          EXPO_NO_DOTENV: '1',
        },
      });

      // Handle process output without flooding the terminal
      let outputBuffer = '';
      let lastFlush = Date.now();
      const FLUSH_INTERVAL = 500; // Flush every 500ms instead of immediately

      this.#devServerProcess.output.pipeTo(
        new WritableStream({
          write: (data) => {
            outputBuffer += data;
            const now = Date.now();

            // Only flush if enough time has passed or buffer is large
            if (now - lastFlush > FLUSH_INTERVAL || outputBuffer.length > 1024) {
              this.#boltTerminal.terminal?.write(outputBuffer);
              outputBuffer = '';
              lastFlush = now;
            }
          },
        }),
      );

      // Listen for server ready
      this.#devServerProcess.output.pipeTo(
        new WritableStream({
          write: (data) => {
            if (data.includes('Expo DevTools') || data.includes('Metro waiting')) {
              toast.success('Dev server started successfully');
            }
          },
        }),
      );
    } catch (error: any) {
      console.error('Failed to start optimized dev server:', error);
      toast.error('Failed to start dev server');
      throw error;
    }
  }

  async attachDeployTerminal(terminal: ITerminal, options?: TerminalInitializationOptions) {
    try {
      const wc = await this.#webcontainer;
      await this.#deployTerminal.init(wc, terminal);
      if (options?.isReload) {
        await this.deployFunctionsAndRunDevServer(options.shouldDeployConvexFunctions ?? false);
      }
    } catch (error: any) {
      console.error('Failed to initialize deploy terminal:', error);
      terminal.write(coloredText.red('Failed to spawn dev server shell\n\n') + error.message);
      return;
    }
  }

  async attachTerminal(terminal: ITerminal) {
    try {
      const shellProcess = await newShellProcess(await this.#webcontainer, terminal);
      this.#terminals.push({ terminal, process: shellProcess });
    } catch (error: any) {
      terminal.write(coloredText.red('Failed to spawn shell\n\n') + error.message);
      return;
    }
  }

  onTerminalResize(cols: number, rows: number) {
    for (const { process } of this.#terminals) {
      process.resize({ cols, rows });
    }
  }

  // Clean up resources
  async cleanup() {
    if (this.#devServerProcess) {
      this.#devServerProcess.kill();
      this.#devServerProcess = null;
    }
  }
}
