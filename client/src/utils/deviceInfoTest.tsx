import React from "react";
import { getDeviceInfo } from "./deviceInfo";

export function DeviceInfoTest() {
  const deviceInfo = getDeviceInfo();

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Device Information Test</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <strong>Device Type:</strong> {deviceInfo.deviceType}
        </div>
        <div>
          <strong>OS:</strong> {deviceInfo.os} {deviceInfo.osVersion}
        </div>
        <div>
          <strong>Browser:</strong> {deviceInfo.browser}{" "}
          {deviceInfo.browserVersion}
        </div>
        <div>
          <strong>Platform:</strong> {deviceInfo.platform}
        </div>
        <div>
          <strong>Screen:</strong> {deviceInfo.screenWidth} ×{" "}
          {deviceInfo.screenHeight}
        </div>
        <div>
          <strong>Viewport:</strong> {deviceInfo.viewportWidth} ×{" "}
          {deviceInfo.viewportHeight}
        </div>
        <div>
          <strong>Pixel Ratio:</strong> {deviceInfo.devicePixelRatio}
        </div>
        <div>
          <strong>Language:</strong> {deviceInfo.language}
        </div>
        <div>
          <strong>Timezone:</strong> {deviceInfo.timezone}
        </div>
        <div>
          <strong>Touch Support:</strong>{" "}
          {deviceInfo.touchSupport ? "Yes" : "No"}
        </div>
        <div>
          <strong>Mobile:</strong> {deviceInfo.isMobile ? "Yes" : "No"}
        </div>
        <div>
          <strong>Tablet:</strong> {deviceInfo.isTablet ? "Yes" : "No"}
        </div>
        <div>
          <strong>Desktop:</strong> {deviceInfo.isDesktop ? "Yes" : "No"}
        </div>
      </div>
      <div className="mt-4">
        <strong>User Agent:</strong>
        <div className="text-xs font-mono bg-white p-2 rounded border mt-1 break-all">
          {deviceInfo.userAgent}
        </div>
      </div>
    </div>
  );
}
