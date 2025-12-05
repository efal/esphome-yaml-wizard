import { ManualConfig, SensorConfig, BinarySensorConfig, SwitchConfig, LightConfig, ButtonConfig } from '../types';

export const generateBasicYaml = (config: ManualConfig): string => {
  const { device, wifi, api, ota, logger, webServer, sensors, binarySensors, switches, lights, buttons } = config;

  let boardConfig = '';

  if (device.platform === 'ESP8266') {
    boardConfig = `esp8266:
  board: ${device.board || 'nodemcuv2'}`;
  } else if (device.platform === 'ESP32') {
    boardConfig = `esp32:
  board: ${device.board || 'esp32dev'}
  framework:
    type: arduino`;
  } else if (device.platform === 'BK72xx') {
    boardConfig = `bk72xx:
  board: ${device.board || 'cb2s'}`;
  } else if (device.platform === 'RTL87xx') {
    boardConfig = `libretiny:
  board: ${device.board || 'generic-rtl8710bn-2mb-788a'}
  framework:
    version: recommended`;
  }

  // Helper to handle secrets without quotes
  const formatValue = (val: string) => {
    if (val.startsWith('!secret')) return val;
    return `"${val}"`;
  };

  let yamlOutput = `esphome:
  name: ${device.name || 'my-device'}
  friendly_name: ${device.friendlyName || 'My Device'}

${boardConfig}

# Enable logging
${logger ? 'logger:' : '# logger: disabled'}

# Enable Home Assistant API
${api ? 'api:\n  password: ""' : '# api: disabled'}

# Enable OTA updates
${ota ? 'ota:\n  - platform: esphome\n    password: ""' : '# ota: disabled'}

wifi:
  ssid: ${formatValue(wifi.ssid)}
  password: ${formatValue(wifi.password)}
  
  # Security settings to prevent warnings in newer ESPHome versions
  min_auth_mode: WPA2
  fast_connect: true

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "${device.name || 'my-device'}-fallback"
    password: ""

${webServer ? 'web_server:\n  port: 80' : '# web_server: disabled'}

# captive_portal:
`;

  // Add sensors
  if (sensors && sensors.length > 0) {
    yamlOutput += '\n# Sensors\nsensor:\n';
    sensors.forEach(sensor => {
      yamlOutput += generateSensorYaml(sensor);
    });
  }

  // Add binary sensors
  if (binarySensors && binarySensors.length > 0) {
    yamlOutput += '\n# Binary Sensors\nbinary_sensor:\n';
    binarySensors.forEach(sensor => {
      yamlOutput += generateBinarySensorYaml(sensor);
    });
  }

  // Add switches
  if (switches && switches.length > 0) {
    yamlOutput += '\n# Switches\nswitch:\n';
    switches.forEach(sw => {
      yamlOutput += generateSwitchYaml(sw);
    });
  }

  // Add lights
  if (lights && lights.length > 0) {
    yamlOutput += '\n# Lights\nlight:\n';
    lights.forEach(light => {
      yamlOutput += generateLightYaml(light, device.platform);
    });
  }

  // Add buttons
  if (buttons && buttons.length > 0) {
    yamlOutput += '\n# Buttons\nbutton:\n';
    buttons.forEach(button => {
      yamlOutput += generateButtonYaml(button);
    });
  }

  return yamlOutput;
};

const generateSensorYaml = (sensor: SensorConfig): string => {
  const updateInterval = sensor.updateInterval || '60s';

  switch (sensor.type) {
    case 'dht':
      const dhtModel = (sensor as any).model || 'DHT22';
      return `  - platform: dht
    pin: ${sensor.pin}
    model: ${dhtModel}
    temperature:
      name: "${sensor.name} Temperature"
    humidity:
      name: "${sensor.name} Humidity"
    update_interval: ${updateInterval}
\n`;

    case 'dallas':
      return `  - platform: dallas
    address: 0x1234567890abcdef  # Replace with actual sensor address
    name: "${sensor.name}"
    update_interval: ${updateInterval}
\n`;

    case 'bme280':
      return `  - platform: bme280
    temperature:
      name: "${sensor.name} Temperature"
    pressure:
      name: "${sensor.name} Pressure"
    humidity:
      name: "${sensor.name} Humidity"
    address: ${(sensor as any).address || '0x76'}
    update_interval: ${updateInterval}
\n`;

    case 'bmp280':
      return `  - platform: bmp280
    temperature:
      name: "${sensor.name} Temperature"
    pressure:
      name: "${sensor.name} Pressure"
    address: ${(sensor as any).address || '0x76'}
    update_interval: ${updateInterval}
\n`;

    case 'adc':
      return `  - platform: adc
    pin: ${sensor.pin}
    name: "${sensor.name}"
    update_interval: ${updateInterval}
    attenuation: ${(sensor as any).attenuation || 'auto'}
\n`;

    case 'wifi_signal':
      return `  - platform: wifi_signal
    name: "${sensor.name}"
    update_interval: ${updateInterval}
\n`;

    case 'uptime':
      return `  - platform: uptime
    name: "${sensor.name}"
    update_interval: ${updateInterval}
\n`;

    default:
      return '';
  }
};

const generateBinarySensorYaml = (sensor: BinarySensorConfig): string => {
  let yaml = `  - platform: gpio
    pin: ${sensor.pin}
    name: "${sensor.name}"
    device_class: ${sensor.deviceClass || 'motion'}
`;

  if (sensor.inverted) {
    yaml += `    inverted: true\n`;
  }

  return yaml + '\n';
};

const generateSwitchYaml = (sw: SwitchConfig): string => {
  let yaml = `  - platform: gpio
    pin: ${sw.pin}
    name: "${sw.name}"
`;

  if (sw.restoreMode) {
    yaml += `    restore_mode: ${sw.restoreMode}\n`;
  }

  if (sw.inverted) {
    yaml += `    inverted: true\n`;
  }

  return yaml + '\n';
};

const generateLightYaml = (light: LightConfig, platform: string): string => {
  switch (light.type) {
    case 'binary':
      return `  - platform: binary
    name: "${light.name}"
    output: output_${light.id}

# Output for binary light
output:
  - platform: gpio
    id: output_${light.id}
    pin: ${light.pin}
\n`;

    case 'monochromatic':
      return `  - platform: monochromatic
    name: "${light.name}"
    output: output_${light.id}

# Output for monochromatic light
output:
  - platform: ${platform === 'ESP8266' ? 'esp8266_pwm' : 'ledc'}
    id: output_${light.id}
    pin: ${light.pin}
\n`;

    case 'rgb':
      return `  - platform: rgb
    name: "${light.name}"
    red: output_${light.id}_r
    green: output_${light.id}_g
    blue: output_${light.id}_b

# Outputs for RGB light
output:
  - platform: ${platform === 'ESP8266' ? 'esp8266_pwm' : 'ledc'}
    id: output_${light.id}_r
    pin: ${light.redPin || 'GPIO12'}
  - platform: ${platform === 'ESP8266' ? 'esp8266_pwm' : 'ledc'}
    id: output_${light.id}_g
    pin: ${light.greenPin || 'GPIO13'}
  - platform: ${platform === 'ESP8266' ? 'esp8266_pwm' : 'ledc'}
    id: output_${light.id}_b
    pin: ${light.bluePin || 'GPIO14'}
\n`;

    case 'rgbw':
      return `  - platform: rgbw
    name: "${light.name}"
    red: output_${light.id}_r
    green: output_${light.id}_g
    blue: output_${light.id}_b
    white: output_${light.id}_w

# Outputs for RGBW light
output:
  - platform: ${platform === 'ESP8266' ? 'esp8266_pwm' : 'ledc'}
    id: output_${light.id}_r
    pin: ${light.redPin || 'GPIO12'}
  - platform: ${platform === 'ESP8266' ? 'esp8266_pwm' : 'ledc'}
    id: output_${light.id}_g
    pin: ${light.greenPin || 'GPIO13'}
  - platform: ${platform === 'ESP8266' ? 'esp8266_pwm' : 'ledc'}
    id: output_${light.id}_b
    pin: ${light.bluePin || 'GPIO14'}
  - platform: ${platform === 'ESP8266' ? 'esp8266_pwm' : 'ledc'}
    id: output_${light.id}_w
    pin: ${light.whitePin || 'GPIO15'}
\n`;

    case 'neopixel':
      const chipset = light.chipset || 'WS2812';
      const numLeds = light.numLeds || 30;

      if (platform === 'ESP8266') {
        return `  - platform: neopixelbus
    name: "${light.name}"
    pin: ${light.pin}
    num_leds: ${numLeds}
    variant: ${chipset}
\n`;
      } else {
        return `  - platform: fastled_clockless
    name: "${light.name}"
    chipset: ${chipset}
    pin: ${light.pin}
    num_leds: ${numLeds}
    rgb_order: GRB
\n`;
      }

    default:
      return '';
  }
};

const generateButtonYaml = (button: ButtonConfig): string => {
  return `  - platform: gpio
    pin:
      number: ${button.pin}
      mode:
        input: true
        pullup: true
      inverted: true
    name: "${button.name}"
\n`;
};