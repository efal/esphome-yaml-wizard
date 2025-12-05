import React from 'react';
import { useState } from 'react';
import { Plus, Trash2, Lightbulb, Power, Thermometer, Circle } from './Icons';
import { SensorConfig, BinarySensorConfig, SwitchConfig, LightConfig, ButtonConfig } from '../types';

interface ComponentEditorProps {
    sensors: SensorConfig[];
    binarySensors: BinarySensorConfig[];
    switches: SwitchConfig[];
    lights: LightConfig[];
    buttons: ButtonConfig[];
    onSensorsChange: (sensors: SensorConfig[]) => void;
    onBinarySensorsChange: (sensors: BinarySensorConfig[]) => void;
    onSwitchesChange: (switches: SwitchConfig[]) => void;
    onLightsChange: (lights: LightConfig[]) => void;
    onButtonsChange: (buttons: ButtonConfig[]) => void;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({
    sensors,
    binarySensors,
    switches,
    lights,
    buttons,
    onSensorsChange,
    onBinarySensorsChange,
    onSwitchesChange,
    onLightsChange,
    onButtonsChange,
}) => {
    const [activeSection, setActiveSection] = useState<'sensors' | 'binary_sensors' | 'switches' | 'lights' | 'buttons'>('sensors');

    // Sensor Functions
    const addSensor = () => {
        const newSensor: SensorConfig = {
            id: `sensor_${Date.now()}`,
            name: 'New Sensor',
            type: 'dht',
            pin: 'GPIO4',
            updateInterval: '60s',
            model: 'DHT22'
        } as any;
        onSensorsChange([...sensors, newSensor]);
    };

    const updateSensor = (index: number, updates: Partial<SensorConfig>) => {
        const updated = [...sensors];
        updated[index] = { ...updated[index], ...updates };
        onSensorsChange(updated);
    };

    const removeSensor = (index: number) => {
        onSensorsChange(sensors.filter((_, i) => i !== index));
    };

    // Binary Sensor Functions
    const addBinarySensor = () => {
        const newSensor: BinarySensorConfig = {
            id: `binary_sensor_${Date.now()}`,
            name: 'New Binary Sensor',
            type: 'gpio',
            pin: 'GPIO5',
            deviceClass: 'motion'
        };
        onBinarySensorsChange([...binarySensors, newSensor]);
    };

    const updateBinarySensor = (index: number, updates: Partial<BinarySensorConfig>) => {
        const updated = [...binarySensors];
        updated[index] = { ...updated[index], ...updates };
        onBinarySensorsChange(updated);
    };

    const removeBinarySensor = (index: number) => {
        onBinarySensorsChange(binarySensors.filter((_, i) => i !== index));
    };

    // Switch Functions
    const addSwitch = () => {
        const newSwitch: SwitchConfig = {
            id: `switch_${Date.now()}`,
            name: 'New Switch',
            type: 'gpio',
            pin: 'GPIO12',
            restoreMode: 'RESTORE_DEFAULT_OFF'
        };
        onSwitchesChange([...switches, newSwitch]);
    };

    const updateSwitch = (index: number, updates: Partial<SwitchConfig>) => {
        const updated = [...switches];
        updated[index] = { ...updated[index], ...updates };
        onSwitchesChange(updated);
    };

    const removeSwitch = (index: number) => {
        onSwitchesChange(switches.filter((_, i) => i !== index));
    };

    // Light Functions
    const addLight = () => {
        const newLight: LightConfig = {
            id: `light_${Date.now()}`,
            name: 'New Light',
            type: 'binary',
            pin: 'GPIO13'
        };
        onLightsChange([...lights, newLight]);
    };

    const updateLight = (index: number, updates: Partial<LightConfig>) => {
        const updated = [...lights];
        updated[index] = { ...updated[index], ...updates };
        onLightsChange(updated);
    };

    const removeLight = (index: number) => {
        onLightsChange(lights.filter((_, i) => i !== index));
    };

    // Button Functions
    const addButton = () => {
        const newButton: ButtonConfig = {
            id: `button_${Date.now()}`,
            name: 'New Button',
            type: 'gpio',
            pin: 'GPIO0'
        };
        onButtonsChange([...buttons, newButton]);
    };

    const updateButton = (index: number, updates: Partial<ButtonConfig>) => {
        const updated = [...buttons];
        updated[index] = { ...updated[index], ...updates };
        onButtonsChange(updated);
    };

    const removeButton = (index: number) => {
        onButtonsChange(buttons.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-esphome-accent flex items-center gap-2 font-semibold mb-4">
                <Circle size={18} /> Components
            </h3>

            {/* Section Tabs */}
            <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
                {[
                    { key: 'sensors', label: 'Sensors', icon: Thermometer },
                    { key: 'binary_sensors', label: 'Binary', icon: Circle },
                    { key: 'switches', label: 'Switches', icon: Power },
                    { key: 'lights', label: 'Lights', icon: Lightbulb },
                    { key: 'buttons', label: 'Buttons', icon: Circle }
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setActiveSection(key as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap ${activeSection === key
                            ? 'bg-esphome-accent text-slate-900'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                    >
                        <Icon size={14} />
                        {label}
                    </button>
                ))}
            </div>

            {/* Sensors Section */}
            {activeSection === 'sensors' && (
                <div className="space-y-3">
                    {sensors.map((sensor, index) => (
                        <div key={sensor.id} className="bg-slate-900 p-3 rounded border border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <input
                                    type="text"
                                    value={sensor.name}
                                    onChange={(e) => updateSensor(index, { name: e.target.value })}
                                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm"
                                    placeholder="Sensor Name"
                                />
                                <button
                                    onClick={() => removeSensor(index)}
                                    className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Type</label>
                                    <select
                                        value={sensor.type}
                                        onChange={(e) => updateSensor(index, { type: e.target.value as any })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="dht">DHT (Temp/Humidity)</option>
                                        <option value="dallas">Dallas (DS18B20)</option>
                                        <option value="bme280">BME280 (I2C)</option>
                                        <option value="bmp280">BMP280 (I2C)</option>
                                        <option value="adc">ADC (Analog)</option>
                                        <option value="wifi_signal">WiFi Signal</option>
                                        <option value="uptime">Uptime</option>
                                    </select>
                                </div>
                                {sensor.type !== 'wifi_signal' && sensor.type !== 'uptime' && (
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">Pin</label>
                                        <input
                                            type="text"
                                            value={sensor.pin || ''}
                                            onChange={(e) => updateSensor(index, { pin: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                            placeholder="GPIO4"
                                        />
                                    </div>
                                )}
                                {sensor.type === 'dht' && (
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">Model</label>
                                        <select
                                            value={(sensor as any).model || 'DHT22'}
                                            onChange={(e) => updateSensor(index, { model: e.target.value as any })}
                                            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                        >
                                            <option value="DHT11">DHT11</option>
                                            <option value="DHT22">DHT22</option>
                                            <option value="AM2302">AM2302</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addSensor}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-gray-300 transition-colors"
                    >
                        <Plus size={16} /> Add Sensor
                    </button>
                </div>
            )}

            {/* Binary Sensors Section */}
            {activeSection === 'binary_sensors' && (
                <div className="space-y-3">
                    {binarySensors.map((sensor, index) => (
                        <div key={sensor.id} className="bg-slate-900 p-3 rounded border border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <input
                                    type="text"
                                    value={sensor.name}
                                    onChange={(e) => updateBinarySensor(index, { name: e.target.value })}
                                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm"
                                    placeholder="Binary Sensor Name"
                                />
                                <button
                                    onClick={() => removeBinarySensor(index)}
                                    className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Type</label>
                                    <select
                                        value={sensor.type}
                                        onChange={(e) => updateBinarySensor(index, { type: e.target.value as any })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="gpio">GPIO</option>
                                        <option value="pir">PIR Motion</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Pin</label>
                                    <input
                                        type="text"
                                        value={sensor.pin}
                                        onChange={(e) => updateBinarySensor(index, { pin: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                        placeholder="GPIO5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Device Class</label>
                                    <select
                                        value={sensor.deviceClass || 'motion'}
                                        onChange={(e) => updateBinarySensor(index, { deviceClass: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="motion">Motion</option>
                                        <option value="door">Door</option>
                                        <option value="window">Window</option>
                                        <option value="occupancy">Occupancy</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addBinarySensor}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-gray-300 transition-colors"
                    >
                        <Plus size={16} /> Add Binary Sensor
                    </button>
                </div>
            )}

            {/* Switches Section */}
            {activeSection === 'switches' && (
                <div className="space-y-3">
                    {switches.map((sw, index) => (
                        <div key={sw.id} className="bg-slate-900 p-3 rounded border border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <input
                                    type="text"
                                    value={sw.name}
                                    onChange={(e) => updateSwitch(index, { name: e.target.value })}
                                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm"
                                    placeholder="Switch Name"
                                />
                                <button
                                    onClick={() => removeSwitch(index)}
                                    className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Pin</label>
                                    <input
                                        type="text"
                                        value={sw.pin}
                                        onChange={(e) => updateSwitch(index, { pin: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                        placeholder="GPIO12"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Restore Mode</label>
                                    <select
                                        value={sw.restoreMode || 'RESTORE_DEFAULT_OFF'}
                                        onChange={(e) => updateSwitch(index, { restoreMode: e.target.value as any })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="RESTORE_DEFAULT_OFF">Default Off</option>
                                        <option value="RESTORE_DEFAULT_ON">Default On</option>
                                        <option value="ALWAYS_OFF">Always Off</option>
                                        <option value="ALWAYS_ON">Always On</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addSwitch}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-gray-300 transition-colors"
                    >
                        <Plus size={16} /> Add Switch
                    </button>
                </div>
            )}

            {/* Lights Section */}
            {activeSection === 'lights' && (
                <div className="space-y-3">
                    {lights.map((light, index) => (
                        <div key={light.id} className="bg-slate-900 p-3 rounded border border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <input
                                    type="text"
                                    value={light.name}
                                    onChange={(e) => updateLight(index, { name: e.target.value })}
                                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm"
                                    placeholder="Light Name"
                                />
                                <button
                                    onClick={() => removeLight(index)}
                                    className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-[10px] text-gray-500 mb-1">Type</label>
                                    <select
                                        value={light.type}
                                        onChange={(e) => updateLight(index, { type: e.target.value as any })}
                                        className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="binary">Binary (On/Off)</option>
                                        <option value="monochromatic">Monochromatic (PWM)</option>
                                        <option value="rgb">RGB</option>
                                        <option value="rgbw">RGBW</option>
                                        <option value="neopixel">NeoPixel/WS2812</option>
                                    </select>
                                </div>
                                {(light.type === 'binary' || light.type === 'monochromatic') && (
                                    <div>
                                        <label className="block text-[10px] text-gray-500 mb-1">Pin</label>
                                        <input
                                            type="text"
                                            value={light.pin || ''}
                                            onChange={(e) => updateLight(index, { pin: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                            placeholder="GPIO13"
                                        />
                                    </div>
                                )}
                                {light.type === 'neopixel' && (
                                    <>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Pin</label>
                                            <input
                                                type="text"
                                                value={light.pin || ''}
                                                onChange={(e) => updateLight(index, { pin: e.target.value })}
                                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                                placeholder="GPIO13"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-1">Num LEDs</label>
                                            <input
                                                type="number"
                                                value={light.numLeds || 30}
                                                onChange={(e) => updateLight(index, { numLeds: parseInt(e.target.value) })}
                                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addLight}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-gray-300 transition-colors"
                    >
                        <Plus size={16} /> Add Light
                    </button>
                </div>
            )}

            {/* Buttons Section */}
            {activeSection === 'buttons' && (
                <div className="space-y-3">
                    {buttons.map((button, index) => (
                        <div key={button.id} className="bg-slate-900 p-3 rounded border border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <input
                                    type="text"
                                    value={button.name}
                                    onChange={(e) => updateButton(index, { name: e.target.value })}
                                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm"
                                    placeholder="Button Name"
                                />
                                <button
                                    onClick={() => removeButton(index)}
                                    className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 mb-1">Pin</label>
                                <input
                                    type="text"
                                    value={button.pin}
                                    onChange={(e) => updateButton(index, { pin: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-xs"
                                    placeholder="GPIO0"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addButton}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm text-gray-300 transition-colors"
                    >
                        <Plus size={16} /> Add Button
                    </button>
                </div>
            )}
        </div>
    );
};

export default ComponentEditor;
