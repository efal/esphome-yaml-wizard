import React, { useState, useEffect } from 'react';
import { ManualConfig, ChipPlatform } from '../types';
import { Cpu, Wifi, Settings, Server } from './Icons';
import { generateBasicYaml } from '../utils/templateGenerator';
import ComponentEditor from './ComponentEditor';

interface ManualBuilderProps {
  onUpdate: (yaml: string) => void;
}

const ManualBuilder: React.FC<ManualBuilderProps> = ({ onUpdate }) => {
  const [config, setConfig] = useState<ManualConfig>({
    device: {
      name: 'living-room-lamp',
      friendlyName: 'Living Room Lamp',
      platform: 'ESP32',
      board: 'esp32dev'
    },
    wifi: {
      ssid: '!secret wifi_ssid',
      password: '!secret wifi_password',
      apFallback: true
    },
    api: true,
    ota: true,
    logger: true,
    webServer: true,
    sensors: [],
    binarySensors: [],
    switches: [],
    lights: [],
    buttons: []
  });

  // Debounce updates to avoid rapid re-renders of the preview
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate(generateBasicYaml(config));
    }, 500);
    return () => clearTimeout(timer);
  }, [config, onUpdate]);

  const handleChange = (section: keyof ManualConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section] as any,
        [field]: value
      }
    }));
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const platform = e.target.value as ChipPlatform;
    let defaultBoard = 'esp32dev';

    if (platform === 'ESP8266') defaultBoard = 'nodemcuv2';
    else if (platform === 'ESP32') defaultBoard = 'esp32dev';
    else if (platform === 'BK72xx') defaultBoard = 'cb2s';
    else if (platform === 'RTL87xx') defaultBoard = 'generic-rtl8710bn-2mb-788a';

    setConfig(prev => ({
      ...prev,
      device: {
        ...prev.device,
        platform,
        board: defaultBoard
      }
    }));
  };

  const handleToggle = (field: keyof ManualConfig) => {
    setConfig(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6 text-sm text-gray-300">

      {/* Device Section */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-esphome-accent flex items-center gap-2 font-semibold mb-4">
          <Cpu size={18} /> Device Settings
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1 text-gray-500">Device Name (ID)</label>
            <input
              type="text"
              value={config.device.name}
              onChange={(e) => handleChange('device', 'name', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 focus:border-esphome-accent focus:outline-none transition-colors"
              placeholder="e.g. kitchen-light"
            />
            <p className="text-xs text-gray-500 mt-1">Unique ID for Home Assistant</p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1 text-gray-500">Friendly Name</label>
            <input
              type="text"
              value={config.device.friendlyName}
              onChange={(e) => handleChange('device', 'friendlyName', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 focus:border-esphome-accent focus:outline-none transition-colors"
              placeholder="e.g. Kitchen Light"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider mb-1 text-gray-500">Platform</label>
              <select
                value={config.device.platform}
                onChange={handlePlatformChange}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 focus:border-esphome-accent focus:outline-none"
              >
                <option value="ESP8266">ESP8266</option>
                <option value="ESP32">ESP32</option>
                <option value="BK72xx">Beken (BK72xx)</option>
                <option value="RTL87xx">Realtek (RTL87xx)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider mb-1 text-gray-500">Board</label>
              <input
                type="text"
                value={config.device.board}
                onChange={(e) => handleChange('device', 'board', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 focus:border-esphome-accent focus:outline-none"
                placeholder="e.g. nodemcuv2"
              />
              <a href="https://esphome.io/index.html#supported-boards" target="_blank" rel="noreferrer" className="text-xs text-esphome-accent hover:underline mt-1 block">
                Check supported boards
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* WiFi Section */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-esphome-accent flex items-center gap-2 font-semibold mb-4">
          <Wifi size={18} /> Connectivity
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1 text-gray-500">WiFi SSID</label>
            <input
              type="text"
              value={config.wifi.ssid}
              onChange={(e) => handleChange('wifi', 'ssid', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 focus:border-esphome-accent focus:outline-none font-mono text-xs"
            />
            <p className="text-[10px] text-gray-500 mt-1">Use !secret wifi_ssid for secrets.yaml</p>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-1 text-gray-500">WiFi Password</label>
            <input
              type="text"
              value={config.wifi.password}
              onChange={(e) => handleChange('wifi', 'password', e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 focus:border-esphome-accent focus:outline-none font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Components Section */}
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h3 className="text-esphome-accent flex items-center gap-2 font-semibold mb-4">
          <Server size={18} /> Components
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-2 bg-slate-900 rounded cursor-pointer hover:bg-slate-850 transition-colors">
            <input
              type="checkbox"
              checked={config.logger}
              onChange={() => handleToggle('logger')}
              className="w-4 h-4 rounded border-slate-600 text-esphome-accent focus:ring-offset-slate-900"
            />
            <span>Logger</span>
          </label>
          <label className="flex items-center gap-3 p-2 bg-slate-900 rounded cursor-pointer hover:bg-slate-850 transition-colors">
            <input
              type="checkbox"
              checked={config.api}
              onChange={() => handleToggle('api')}
              className="w-4 h-4 rounded border-slate-600 text-esphome-accent focus:ring-offset-slate-900"
            />
            <span>Native API (Home Assistant)</span>
          </label>
          <label className="flex items-center gap-3 p-2 bg-slate-900 rounded cursor-pointer hover:bg-slate-850 transition-colors">
            <input
              type="checkbox"
              checked={config.ota}
              onChange={() => handleToggle('ota')}
              className="w-4 h-4 rounded border-slate-600 text-esphome-accent focus:ring-offset-slate-900"
            />
            <span>OTA Updates</span>
          </label>
          <label className="flex items-center gap-3 p-2 bg-slate-900 rounded cursor-pointer hover:bg-slate-850 transition-colors">
            <input
              type="checkbox"
              checked={config.webServer}
              onChange={() => handleToggle('webServer')}
              className="w-4 h-4 rounded border-slate-600 text-esphome-accent focus:ring-offset-slate-900"
            />
            <span>Web Server</span>
          </label>
        </div>
      </div>

      {/* Components Section */}
      <ComponentEditor
        sensors={config.sensors}
        binarySensors={config.binarySensors}
        switches={config.switches}
        lights={config.lights}
        buttons={config.buttons}
        onSensorsChange={(sensors) => setConfig(prev => ({ ...prev, sensors }))}
        onBinarySensorsChange={(binarySensors) => setConfig(prev => ({ ...prev, binarySensors }))}
        onSwitchesChange={(switches) => setConfig(prev => ({ ...prev, switches }))}
        onLightsChange={(lights) => setConfig(prev => ({ ...prev, lights }))}
        onButtonsChange={(buttons) => setConfig(prev => ({ ...prev, buttons }))}
      />
    </div>
  );
};

export default ManualBuilder;