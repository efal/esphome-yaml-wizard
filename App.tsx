import React, { useState } from 'react';
import ManualBuilder from './components/ManualBuilder';
import AiGenerator from './components/AiGenerator';
import { Settings, Wand2, Copy, Download, Check, Code, Trash2, AlertTriangle } from './components/Icons';

function App() {
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const [yamlContent, setYamlContent] = useState<string>('# Your generated configuration will appear here\n');
  const [copied, setCopied] = useState(false);

  // Check for common formatting errors (like leftover markdown blocks)
  const hasFormattingError = yamlContent.trim().startsWith('```');

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'esphome.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if(window.confirm("Clear the editor?")) {
        setYamlContent("");
    }
  };

  const fixFormatting = () => {
    let cleaned = yamlContent.trim();
    // Remove starting ```yaml or ``` and ending ```
    cleaned = cleaned.replace(/^```(?:yaml)?\s*/i, '').replace(/\s*```$/, '');
    setYamlContent(cleaned);
  };

  return (
    <div className="min-h-screen bg-[#1a1b26] text-gray-100 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-[#16161e] border-b border-slate-800 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20">
              <Code className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300">
                ESPHome YAML Wizard
              </h1>
              <p className="text-xs text-gray-500">For ESP8266, ESP32 & Beken Chips</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a 
              href="https://esphome.io" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Docs
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Inputs */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-full">
          <div className="flex bg-[#16161e] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                activeTab === 'manual' 
                  ? 'bg-slate-700 text-white shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings size={16} /> Basic Setup
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                activeTab === 'ai' 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Wand2 size={16} /> AI Assistant
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activeTab === 'manual' ? (
              <ManualBuilder onUpdate={setYamlContent} />
            ) : (
              <AiGenerator currentYaml={yamlContent} onYamlGenerated={setYamlContent} />
            )}
          </div>
        </div>

        {/* Right Panel: Editor */}
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-140px)] sticky top-24">
          <div className="bg-[#16161e] border-t border-x border-slate-700 rounded-t-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-xs font-mono px-2 py-1 bg-slate-800 rounded">esphome.yaml</span>
              {activeTab === 'ai' && <span className="text-[10px] text-indigo-400 animate-pulse">AI Mode Active</span>}
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={handleClear}
                className="p-1.5 text-gray-400 hover:text-red-400 transition-colors rounded hover:bg-slate-800"
                title="Clear Editor"
              >
                <Trash2 size={16} />
              </button>
              <div className="w-px h-4 bg-slate-700 mx-1"></div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded text-xs transition-colors border border-slate-700"
              >
                {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-esphome-accent/10 hover:bg-esphome-accent/20 text-esphome-accent rounded text-xs transition-colors border border-esphome-accent/20"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          </div>

          {hasFormattingError && (
            <div className="bg-amber-900/40 border-x border-amber-900/50 p-2 flex items-center justify-between px-4">
              <div className="flex items-center gap-2 text-amber-200 text-xs">
                <AlertTriangle size={14} />
                <span>Detected Markdown formatting (invalid YAML).</span>
              </div>
              <button 
                onClick={fixFormatting}
                className="text-xs bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded transition-colors"
              >
                Fix Format
              </button>
            </div>
          )}
          
          <div className="flex-1 relative group">
            <textarea 
              value={yamlContent}
              onChange={(e) => setYamlContent(e.target.value)}
              className={`w-full h-full bg-[#13141c] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none border-b border-x border-slate-700 rounded-b-lg leading-relaxed selection:bg-indigo-500/30 ${hasFormattingError ? 'border-amber-900/50' : ''}`}
              spellCheck="false"
              placeholder="# Generated YAML will appear here..."
            />
          </div>
          
          <div className="mt-2 text-xs text-gray-500 flex justify-between px-1">
             <span>Tip: You can edit the YAML manually before downloading.</span>
             <span>ESPHome Version: 2024.x+</span>
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;