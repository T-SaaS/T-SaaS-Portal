// Device information detection utility
export interface DeviceInfo {
  userAgent: string;
  platform: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  language: string;
  timezone: string;
  touchSupport: boolean;
  deviceType: "mobile" | "tablet" | "desktop";
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
}

export function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent;
  const screen = window.screen;
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Detect platform and OS
  let platform = "unknown";
  let os = "unknown";
  let osVersion = "unknown";

  if (userAgent.includes("Windows")) {
    platform = "Windows";
    os = "Windows";
    const match = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (match) {
      const version = parseFloat(match[1]);
      if (version >= 10) osVersion = "10+";
      else if (version >= 6.3) osVersion = "8.1";
      else if (version >= 6.2) osVersion = "8";
      else if (version >= 6.1) osVersion = "7";
      else osVersion = "Vista or earlier";
    }
  } else if (userAgent.includes("Mac OS X")) {
    platform = "macOS";
    os = "macOS";
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    if (match) {
      osVersion = match[1].replace("_", ".");
    }
  } else if (userAgent.includes("Linux")) {
    platform = "Linux";
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    platform = "Android";
    os = "Android";
    const match = userAgent.match(/Android (\d+\.\d+)/);
    if (match) {
      osVersion = match[1];
    }
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    platform = "iOS";
    os = "iOS";
    const match = userAgent.match(/OS (\d+[._]\d+)/);
    if (match) {
      osVersion = match[1].replace("_", ".");
    }
  }

  // Detect browser
  let browser = "unknown";
  let browserVersion = "unknown";

  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome";
    const match = userAgent.match(/Chrome\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
    const match = userAgent.match(/Firefox\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
    const match = userAgent.match(/Version\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  } else if (userAgent.includes("Edg")) {
    browser = "Edge";
    const match = userAgent.match(/Edg\/(\d+\.\d+)/);
    if (match) browserVersion = match[1];
  }

  // Detect device type
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  const isTablet =
    /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent) ||
    (screen.width >= 768 && screen.height >= 1024 && isMobile);
  const isDesktop = !isMobile && !isTablet;

  let deviceType: "mobile" | "tablet" | "desktop" = "desktop";
  if (isMobile && !isTablet) deviceType = "mobile";
  else if (isTablet) deviceType = "tablet";

  // Detect touch support
  const touchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  return {
    userAgent,
    platform,
    isMobile,
    isTablet,
    isDesktop,
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
    devicePixelRatio: window.devicePixelRatio || 1,
    language: navigator.language || "unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    touchSupport,
    deviceType,
    browser,
    browserVersion,
    os,
    osVersion,
  };
}

// Get a simplified device fingerprint for logging
export function getDeviceFingerprint(): string {
  const info = getDeviceInfo();
  return `${info.deviceType}-${info.os}-${info.browser}-${info.screenWidth}x${info.screenHeight}`;
}
