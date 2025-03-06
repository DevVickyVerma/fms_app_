import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "uk.credentia.fms",
  appName: "FMS-Credentia",
  webDir: "build",
  // server: { url: "http://192.168.1.187:3000", cleartext: true },
  plugins: {
    PushNotifications: { presentationOptions: ["badge", "sound", "alert"] },
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
    },
  },
};

export default config;
