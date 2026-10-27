/**
 * WargaQu 1.2.7 - Progressive Web App (PWA) Manager
 * Menangani pendaftaran Service Worker dengan path relatif (aman untuk GitHub Pages),
 * event install prompt (Android/Desktop), dan panduan instalasi iOS Safari.
 */

// Interface untuk BeforeInstallPromptEvent (Chrome/Edge/Android)
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

type PWAInstallListener = (canInstall: boolean) => void;
type PWAUpdateListener = (registration: ServiceWorkerRegistration) => void;

class PWAService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private installListeners: Set<PWAInstallListener> = new Set();
  private updateListeners: Set<PWAUpdateListener> = new Set();
  private swRegistration: ServiceWorkerRegistration | null = null;
  private isRegistered = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initInstallPromptListener();
    }
  }

  /**
   * Mendaftarkan Service Worker dengan path relatif './sw.js'
   * Sangat krusial agar berjalan mulus di GitHub Pages (sub-direktori) maupun root domain.
   */
  public registerServiceWorker(): void {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.log('[PWA] Service Worker tidak didukung di lingkungan ini.');
      return;
    }

    if (this.isRegistered) return;
    this.isRegistered = true;

    // Tunggu sampai window onload agar tidak memblokir loading awal app
    const onWindowLoad = () => {
      // Menggunakan path relatif './sw.js' dengan scope './'
      navigator.serviceWorker
        .register('./sw.js', { scope: './' })
        .then((registration) => {
          this.swRegistration = registration;
          console.log('[PWA] WargaQu Service Worker terdaftar dengan scope:', registration.scope);

          // Cek pembaruan service worker
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Konten baru tersedia, beri tahu listener
                  console.log('[PWA] Versi baru WargaQu tersedia.');
                  this.notifyUpdateListeners(registration);
                } else {
                  console.log('[PWA] Konten berhasil dicache untuk penggunaan offline.');
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error('[PWA] Gagal mendaftarkan Service Worker:', error);
        });

      // Menangani pergantian controller
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    };

    if (document.readyState === 'complete') {
      onWindowLoad();
    } else {
      window.addEventListener('load', onWindowLoad);
    }
  }

  /**
   * Menangkap event 'beforeinstallprompt' dari browser Android / Desktop
   */
  private initInstallPromptListener(): void {
    window.addEventListener('beforeinstallprompt', (e: BeforeInstallPromptEvent) => {
      // Mencegah mini-infobar default browser agar kita bisa memicu dari tombol custom kita
      e.preventDefault();
      this.deferredPrompt = e;
      this.notifyInstallListeners(true);
      console.log('[PWA] beforeinstallprompt aktif, siap di-install.');
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.notifyInstallListeners(false);
      console.log('[PWA] Aplikasi WargaQu berhasil di-install!');
    });
  }

  /**
   * Memicu prompt instalasi resmi browser (Android / Chrome / Edge)
   */
  public async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.warn('[PWA] Install prompt belum siap atau aplikasi sudah terpasang.');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      const accepted = choiceResult.outcome === 'accepted';
      this.deferredPrompt = null;
      this.notifyInstallListeners(false);
      return accepted;
    } catch (err) {
      console.error('[PWA] Gagal menampilkan prompt instalasi:', err);
      return false;
    }
  }

  /**
   * Cek apakah aplikasi saat ini sudah terpasang dan berjalan dalam mode standalone (PWA)
   */
  public isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    const isStandaloneMQ = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
    return isStandaloneMQ || isIOSStandalone;
  }

  /**
   * Cek apakah perangkat menggunakan iOS (iPhone/iPad)
   */
  public isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }

  /**
   * Cek apakah tombol instalasi dapat ditampilkan (Android/Desktop prompt tersedia)
   */
  public canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isStandalone();
  }

  /**
   * Paksa update service worker (skipWaiting)
   */
  public updateNow(): void {
    if (this.swRegistration && this.swRegistration.waiting) {
      this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Subscribe ke status ketersediaan install prompt
  public onInstallAvailabilityChange(listener: PWAInstallListener): () => void {
    this.installListeners.add(listener);
    listener(this.canInstall());
    return () => {
      this.installListeners.delete(listener);
    };
  }

  private notifyInstallListeners(canInstall: boolean): void {
    this.installListeners.forEach((listener) => {
      try {
        listener(canInstall);
      } catch (e) {
        console.error(e);
      }
    });
  }

  // Subscribe ke notifikasi adanya update app baru
  public onUpdateAvailable(listener: PWAUpdateListener): () => void {
    this.updateListeners.add(listener);
    return () => {
      this.updateListeners.delete(listener);
    };
  }

  private notifyUpdateListeners(reg: ServiceWorkerRegistration): void {
    this.updateListeners.forEach((listener) => {
      try {
        listener(reg);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

export const pwaService = new PWAService();
export default pwaService;
