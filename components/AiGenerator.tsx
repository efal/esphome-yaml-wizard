import React, { useState } from 'react';
import { Wand2, Play, Terminal, Bug } from './Icons';
import { generateEspHomeYaml, fixEspHomeYaml } from '../services/geminiService';

interface AiGeneratorProps {
  currentYaml: string;
  onYamlGenerated: (yaml: string) => void;
}

const AiGenerator: React.FC<AiGeneratorProps> = ({ currentYaml, onYamlGenerated }) => {
  const [mode, setMode] = useState<'create' | 'debug'>('create');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      let result = '';
      if (mode === 'create') {
        result = await generateEspHomeYaml(input, currentYaml);
      } else {
        result = await fixEspHomeYaml(currentYaml, input);
      }
      onYamlGenerated(result);
    } catch (err) {
      setError("Failed to process request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "ESP32 with a DHT22 sensor on pin 4",
    "Beken WB2S chip with a relay on P6 and button on P8",
    "ESP8266 controlling a WS2812B LED strip on D2",
    "Display current time on an OLED ssd1306 display"
  ];

  return (
    <div className="space-y-4 text-sm text-gray-300 h-full flex flex-col">
      {/* Mode Toggle */}
      <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700">
        <button
          onClick={() => { setMode('create'); setInput(''); }}
          className={`flex-1 py-1.5 px-3 rounded flex items-center justify-center gap-2 text-xs font-medium transition-all ${
            mode === 'create' 
              ? 'bg-pink-600 text-white shadow-md shadow-pink-900/20' 
              : 'text-gray-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Wand2 size={14} /> Create
        </button>
        <button
          onClick={() => { setMode('debug'); setInput(''); }}
          className={`flex-1 py-1.5 px-3 rounded flex items-center justify-center gap-2 text-xs font-medium transition-all ${
            mode === 'debug' 
              ? 'bg-amber-600 text-white shadow-md shadow-amber-900/20' 
              : 'text-gray-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bug size={14} /> Fix Error
        </button>
      </div>

      <div className={`
        p-6 rounded-lg border flex-1 flex flex-col
        ${mode === 'create' 
          ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30' 
          : 'bg-gradient-to-br from-amber-900/30 to-red-900/30 border-amber-500/30'}
      `}>
        <h3 className="text-white flex items-center gap-2 font-semibold mb-2 text-lg">
          {mode === 'create' ? (
            <><Wand2 size={20} className="text-pink-400" /> AI Assistant</>
          ) : (
            <><Bug size={20} className="text-amber-400" /> Error Fixer</>
          )}
        </h3>
        <p className="text-gray-400 mb-4 text-xs">
          {mode === 'create' 
            ? "Describe your device and components. The AI will generate the configuration."
            : "Paste your ESPHome validation error or log output here. The AI will try to fix the YAML."}
        </p>
        
        <div className="relative flex-1">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full h-full min-h-[120px] bg-slate-900/80 border rounded-lg p-4 text-gray-100 focus:ring-1 focus:outline-none transition-all resize-none
              ${mode === 'create' 
                ? 'border-indigo-500/40 focus:border-pink-500 focus:ring-pink-500' 
                : 'border-amber-500/40 focus:border-amber-500 focus:ring-amber-500 font-mono text-xs'}`}
            placeholder={mode === 'create' 
              ? "e.g., I have an ESP32 with a DHT22 sensor on GPIO 14..." 
              : "e.g., Component dht cannot be loaded via ESPHome..."}
          />
          <button
            onClick={handleAction}
            disabled={isLoading || !input.trim()}
            className={`absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white transition-all
              ${isLoading || !input.trim() 
                ? 'bg-slate-700 cursor-not-allowed opacity-50' 
                : mode === 'create'
                  ? 'bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 shadow-lg'
                  : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg'
              }`}
          >
            {isLoading ? (
              <span className="animate-spin">⌛</span>
            ) : (
              mode === 'create' ? <Play size={16} fill="currentColor" /> : <Bug size={16} />
            )}
            {isLoading 
              ? (mode === 'create' ? 'Generating...' : 'Fixing...') 
              : (mode === 'create' ? 'Generate YAML' : 'Fix Code')}
          </button>
        </div>
        {error && <p className="text-red-400 mt-2 text-xs">{error}</p>}
      </div>

      {mode === 'create' && (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h4 className="text-gray-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            <Terminal size={14} /> Try these examples
          </h4>
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setInput(s)}
                className="w-full text-left p-2 rounded hover:bg-slate-700 text-gray-400 hover:text-white transition-colors text-xs border border-transparent hover:border-slate-600 truncate"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiGenerator;