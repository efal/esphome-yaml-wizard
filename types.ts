export type ChipPlatform = 'ESP8266' | 'ESP32' | 'BK72xx' | 'RTL87xx';

export interface WifiConfig {
  ssid: string;
  password: string;
  apFallback: boolean;
}

export interface DeviceConfig {
  name: string;
  friendlyName: string;
  platform: ChipPlatform;
  board: string;
}

// Component Types
export type SensorType =
  | 'dht'
  | 'dallas'
  | 'bme280'
  | 'bmp280'
  | 'adc'
  | 'wifi_signal'
  | 'uptime';

export type BinarySensorType =
  | 'gpio'
  | 'pir';

export type SwitchType =
  | 'gpio'
  | 'relay';

export type LightType =
  | 'binary'
  | 'monochromatic'
  | 'rgb'
  | 'rgbw'
  | 'neopixel';

export type ButtonType =
  | 'gpio';

// Component Interfaces
export interface BaseSensor {
  id: string;
  name: string;
  type: SensorType;
  pin?: string;
  updateInterval?: string;
}

export interface DHTSensor extends BaseSensor {
  type: 'dht';
  model: 'DHT11' | 'DHT22' | 'AM2302';
}

export interface DallasSensor extends BaseSensor {
  type: 'dallas';
}

export interface BME280Sensor extends BaseSensor {
  type: 'bme280';
  address?: string;
}

export interface BMP280Sensor extends BaseSensor {
  type: 'bmp280';
  address?: string;
}

export interface ADCSensor extends BaseSensor {
  type: 'adc';
  attenuation?: string;
}

export interface WifiSignalSensor extends BaseSensor {
  type: 'wifi_signal';
}

export interface UptimeSensor extends BaseSensor {
  type: 'uptime';
}

export type SensorConfig =
  | DHTSensor
  | DallasSensor
  | BME280Sensor
  | BMP280Sensor
  | ADCSensor
  | WifiSignalSensor
  | UptimeSensor;

export interface BinarySensorConfig {
  id: string;
  name: string;
  type: BinarySensorType;
  pin: string;
  inverted?: boolean;
  deviceClass?: string;
}

export interface SwitchConfig {
  id: string;
  name: string;
  type: SwitchType;
  pin: string;
  inverted?: boolean;
  restoreMode?: 'RESTORE_DEFAULT_OFF' | 'RESTORE_DEFAULT_ON' | 'ALWAYS_OFF' | 'ALWAYS_ON';
}

export interface LightConfig {
  id: string;
  name: string;
  type: LightType;
  pin?: string;
  redPin?: string;
  greenPin?: string;
  bluePin?: string;
  whitePin?: string;
  numLeds?: number;
  chipset?: 'WS2812' | 'WS2811' | 'SK6812' | 'APA102';
}

export interface ButtonConfig {
  id: string;
  name: string;
  type: ButtonType;
  pin: string;
}

export interface ManualConfig {
  device: DeviceConfig;
  wifi: WifiConfig;
  api: boolean;
  ota: boolean;
  logger: boolean;
  webServer: boolean;
  // Components
  sensors: SensorConfig[];
  binarySensors: BinarySensorConfig[];
  switches: SwitchConfig[];
  lights: LightConfig[];
  buttons: ButtonConfig[];
}

export interface GeneratedResult {
  yaml: string;
  explanation?: string;
}
