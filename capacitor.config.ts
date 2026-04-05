import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aiprojects.weight-achiever_CAP',
  appName: '体重一键记录(成就版)',
  webDir: 'out',
  server: { androidScheme: 'https' },
  android: { buildOptions: { releaseType: 'APK' } }
};

export default config;
