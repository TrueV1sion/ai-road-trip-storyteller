import { useState, useEffect } from 'react';
import { Platform, Dimensions } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

interface DeviceInfo {
  platform: 'ios' | 'android' | 'web';
  deviceType: 'phone' | 'tablet' | 'desktop' | 'unknown';
  screenSize: {
    width: number;
    height: number;
  };
  isTablet: boolean;
  deviceName?: string;
  osVersion?: string;
  appVersion: string;
  buildNumber?: string;
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    const { width, height } = Dimensions.get('window');
    const isTablet = Math.min(width, height) >= 768;
    
    return {
      platform: Platform.OS as 'ios' | 'android' | 'web',
      deviceType: Platform.OS === 'web' ? 'desktop' : isTablet ? 'tablet' : 'phone',
      screenSize: { width, height },
      isTablet,
      appVersion: Constants.expoConfig?.version || '1.0.0',
    };
  });

  useEffect(() => {
    const updateDeviceInfo = async () => {
      const { width, height } = Dimensions.get('window');
      const isTablet = Math.min(width, height) >= 768;
      
      let deviceType: DeviceInfo['deviceType'] = 'unknown';
      if (Platform.OS === 'web') {
        deviceType = width >= 1024 ? 'desktop' : isTablet ? 'tablet' : 'phone';
      } else {
        deviceType = isTablet ? 'tablet' : 'phone';
      }

      const info: DeviceInfo = {
        platform: Platform.OS as 'ios' | 'android' | 'web',
        deviceType,
        screenSize: { width, height },
        isTablet,
        appVersion: Constants.expoConfig?.version || '1.0.0',
        buildNumber: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode?.toString(),
      };

      // Add native device info if available
      if (Platform.OS !== 'web') {
        info.deviceName = Device.deviceName || undefined;
        info.osVersion = Device.osVersion || undefined;
      }

      setDeviceInfo(info);
    };

    updateDeviceInfo();

    // Listen for dimension changes
    const subscription = Dimensions.addEventListener('change', updateDeviceInfo);

    return () => subscription?.remove();
  }, []);

  return deviceInfo;
}