export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY_WARGAQU = 'wargaqu_theme_mode';
const STORAGE_KEY_MUAMALAH = 'muamalah_theme_mode';

export const ThemeService = {
  getTheme(): ThemeMode {
    try {
      const mode =
        localStorage.getItem(STORAGE_KEY_WARGAQU) ||
        localStorage.getItem(STORAGE_KEY_MUAMALAH);
      if (mode === 'dark' || mode === 'light') return mode;
    } catch (e) {
      console.warn('Gagal membaca tema dari localStorage', e);
    }
    return 'light'; // Default: high contrast light mode
  },

  saveTheme(mode: ThemeMode): void {
    try {
      localStorage.setItem(STORAGE_KEY_WARGAQU, mode);
      localStorage.setItem(STORAGE_KEY_MUAMALAH, mode);
      if (typeof document !== 'undefined') {
        if (mode === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wargaqu_theme_changed', { detail: mode }));
      }
    } catch (e) {
      console.warn('Gagal menyimpan tema ke localStorage', e);
    }
  },

  toggleTheme(): ThemeMode {
    const current = this.getTheme();
    const next: ThemeMode = current === 'light' ? 'dark' : 'light';
    this.saveTheme(next);
    return next;
  },

  initTheme(): ThemeMode {
    const mode = this.getTheme();
    this.saveTheme(mode);
    return mode;
  },
};
