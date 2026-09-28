import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vokter.app',
  appName: 'VOKTER',
  webDir: 'dist',
  plugins: {
    // Iconos claros en las barras del sistema: el fondo de la app es oscuro.
    SystemBars: { style: 'DARK' }
  }
};

export default config;
