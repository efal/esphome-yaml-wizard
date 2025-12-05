# ESPHome YAML Wizard

A Progressive Web App for generating ESPHome YAML configurations with AI assistance and manual component configuration.

## Features

- 🤖 **AI-Assisted Generation** - Use Google Gemini AI to generate complex configurations
- 🔧 **Manual Component Builder** - Add sensors, switches, lights offline without AI
- 📱 **Progressive Web App** - Install on any device, works offline
- 🌐 **Multi-Platform Support** - ESP8266, ESP32, Beken (BK72xx), Realtek (RTL87xx)
- 📦 **Component Library** - Pre-configured templates for common sensors and actuators

## Supported Components

### Sensors
- DHT11/DHT22/AM2302 (Temperature & Humidity)
- Dallas DS18B20 (Temperature)
- BME280 (Temperature, Humidity, Pressure)
- BMP280 (Temperature, Pressure)
- ADC (Analog)
- WiFi Signal Strength
- Uptime

### Binary Sensors
- GPIO
- PIR Motion Detector

### Switches
- GPIO Relay

### Lights
- Binary (On/Off)
- Monochromatic (PWM)
- RGB
- RGBW
- NeoPixel/WS2812

### Buttons
- GPIO Buttons

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Netlify

### Option 1: Deploy via Git

1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Netlify will automatically detect the build settings from `netlify.toml`
4. Add your `GEMINI_API_KEY` as an environment variable in Netlify settings

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Environment Variables

Add these environment variables in your Netlify dashboard:

- `GEMINI_API_KEY` - Your Google Gemini API key (optional, only for AI features)

## PWA Features

- ✅ **Installable** - Add to home screen on mobile and desktop
- ✅ **Offline Support** - Service Worker caches assets for offline use
- ✅ **Auto-Updates** - Prompts users when new version is available
- ✅ **Responsive** - Works on all screen sizes

## Project Structure

```
esphome-yaml-wizard/
├── public/
│   ├── icons/           # PWA icons
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service Worker
├── components/
│   ├── ManualBuilder.tsx      # Manual configuration UI
│   ├── AiGenerator.tsx        # AI-powered generator
│   ├── ComponentEditor.tsx    # Component configuration
│   └── Icons.tsx              # Icon components
├── services/
│   └── geminiService.ts       # Google Gemini API integration
├── utils/
│   └── templateGenerator.ts   # YAML generation
├── types.ts            # TypeScript definitions
├── netlify.toml        # Netlify configuration
└── vite.config.ts      # Vite configuration
```

## Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling (via CDN)
- **Lucide React** - Icons
- **Google Gemini AI** - AI assistance (optional)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
