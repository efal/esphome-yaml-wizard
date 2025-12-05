import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert ESPHome YAML configuration generator. 
Your goal is to generate complete, valid, and safe YAML configuration files for Home Assistant integration.

Supported Platforms:
- ESP8266 (platform: esp8266)
- ESP32 (platform: esp32)
- Beken/LibreTiny (platform: bk72xx)

Rules:
1. Always include 'esphome', 'wifi', 'api', and 'ota' sections unless explicitly asked not to.
2. For 'ota', always explicitly set 'platform: esphome' (e.g., '- platform: esphome').
3. For Beken chips (BK7231T, BK7231N, etc.), use the 'bk72xx' top-level component. Do NOT use 'libretiny' or 'esphome: platform: libretiny'. 
   Example:
   bk72xx:
     board: cb2s
4. If the user asks for sensors, switches, or lights, configure them with appropriate GPIOs. If GPIOs aren't specified, use placeholders like 'GPIOXX' and add a comment.
5. Output ONLY the YAML code within a code block if possible, or just the raw YAML if requested.
6. Provide a brief explanation *after* the YAML if necessary, but keep the YAML clean.
7. For 'wifi', ALWAYS include 'fast_connect: true' and 'min_auth_mode: WPA2' to silence security warnings.
8. For 'light' components using 'neopixelbus', ALWAYS use the key 'variant' for the chip model (e.g., 'variant: WS2812'). NEVER use 'type' for the chip model. Default to 'variant: WS2812' if not specified.
9. For 'esp8266', DO NOT include 'framework: type: arduino'. This is specific to ESP32 and causes validation errors on ESP8266. If you need to set framework for ESP8266, only use 'version', or omit the framework section entirely.
10. PREFER block-style lists (using '-') over flow-style lists (using '[]') to avoid syntax errors. Example: Use '- 192.168.1.1' instead of '[192.168.1.1]'.
11. ENSURE strictly valid YAML syntax. Every key must be followed by a colon (e.g., 'board: esp32dev', NOT 'board esp32dev'). Check indentation carefully.
12. For 'display' -> 'font' -> 'glyphs', ALWAYS use a single double-quoted string containing all characters (e.g., glyphs: " !\\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\\\]^_abcdefghijklmnopqrstuvwxyz{|}~") instead of a list of individual characters. This prevents YAML syntax errors with quoting.
13. For 'font' components, ALWAYS use the Google Fonts shorthand 'file: gfonts://<FamilyName>' (e.g. 'file: gfonts://Roboto' or 'file: gfonts://Open+Sans') instead of local paths like 'fonts/arial.ttf', unless the user explicitly asks for a local file. This ensures the config works immediately without uploading files.
14. For 'ssd1306_i2c' display models, ALWAYS use the full model name like 'SSD1306_128X64' or 'SSD1306_128X32'. Do not use short versions like '128x64'.
15. In C++ lambdas (e.g., for displays), ALWAYS use 'auto now = id(time_id).now();' to get the time. NEVER use 'time::ESPTime now = ...' as the namespace is often incorrect.
16. To check if time is valid in a lambda, check the time object itself: 'if (now.is_valid())', NOT 'if (id(time_id).is_valid())'.
17. 'on_boot' is NOT a top-level component. It MUST be placed nested INSIDE the 'esphome:' section. Example:
   esphome:
     name: my-device
     on_boot:
       - priority: 600
         then: ...
18. SENSOR PLACEMENT: Sensor platforms (dht, dallas, uptime, wifi_signal, etc.) MUST be defined under the 'sensor:' domain using '- platform: ...'. Do NOT place them at the root level.
   CORRECT:
     sensor:
       - platform: dht
         pin: GPIO4
         ...
   INCORRECT:
     dht:
       pin: GPIO4
       ...
19. USE SECRETS: For WiFi credentials, prioritize using '!secret wifi_ssid' and '!secret wifi_password' instead of placeholders or hardcoded values, as the user has a secrets.yaml file.
`;

const DEBUG_SYSTEM_INSTRUCTION = `
You are an expert ESPHome YAML debugger.
Your goal is to fix the provided ESPHome YAML configuration based on the error message provided by the user.

Rules:
1. Analyze the 'Current YAML' and the 'Error Message'.
2. Fix the specific error in the YAML.
3. If the error is 'ota requires a platform key', change 'ota:' to 'ota:\n  - platform: esphome'.
4. If the error is about 'neopixelbus' missing 'variant', add 'variant: WS2812'. If 'type: WS2812' exists, change 'type' to 'variant'.
5. If the warning is about 'min_auth_mode', add 'min_auth_mode: WPA2' to the wifi config.
6. If the error is '[type] is an invalid option for [framework]' (specifically for esp8266), remove the 'type: arduino' line or the entire 'framework' section for the esp8266 platform.
7. If the error mentions 'Must have R in type' for neopixelbus, it means 'type' was used incorrectly. Rename 'type' to 'variant'.
8. If the error is 'expected ',' or ']', but got '<scalar>', check for malformed flow-style lists (e.g., [a b] missing comma) or unquoted brackets in strings. Convert flow-style lists '[...]' to block-style lists '- ...' to fix this.
9. If the error is 'scanning a simple key' and 'could not find expected ':'', look for missing colons after keys (e.g. 'board esp32' -> 'board: esp32') or correct invalid indentation. Ensure every key-value pair is properly separated.
10. If the error occurs in 'glyphs' (font configuration) or involves quoting issues in a list, replace the complex list of glyphs with this standard ASCII string: glyphs: " !\\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\\\]^_abcdefghijklmnopqrstuvwxyz{|}~"
11. If the error is 'Could not find file' regarding a font (e.g., .ttf or .otf), replace the local 'file:' path with a Google Fonts URI like 'file: gfonts://Roboto' to fix the missing file issue.
12. If the error is about 'Unknown value' for a display model (e.g. '128x64'), replace it with the full model name suggested in the error, such as 'SSD1306_128X64'.
13. If the error is 'class ... SNTPComponent has no member named is_valid', change the lambda code from 'id(time_id).is_valid()' to 'id(time_id).now().is_valid()'.
14. If the error is 'ESPTime is not a member of esphome::time', change 'time::ESPTime' to 'auto' or 'esphome::ESPTime' in the lambda code.
15. If the error is 'Component not found: on_boot', it means 'on_boot' is incorrectly placed at the root level. Move the 'on_boot:' block (and its contents) so it is nested/indented INSIDE the 'esphome:' section.
16. Return the COMPLETE fixed YAML file. Do not just return the snippet.
17. Add a comment in the YAML near the fix explaining what was changed.
18. Output ONLY the YAML content.
19. If the error is "Component [name] cannot be loaded via YAML (no CONFIG_SCHEMA)", it means a platform component (like 'dht', 'dallas', 'uptime', 'wifi_signal') was placed at the root level. Move this component under the 'sensor:' section (e.g. 'sensor:\n  - platform: dht\n    ...').
20. If the error involves 'libretiny' or 'bk72xx' board configuration, ensure the top-level key is 'bk72xx' for Beken chips (e.g., 'bk72xx:\n  board: ...').
`;

// Helper to strip markdown code blocks if the AI includes them
const cleanYamlResponse = (text: string): string => {
  if (!text) return "";
  let cleaned = text.trim();
  
  // Regex to match markdown code blocks ```yaml ... ``` or just ``` ... ```
  const codeBlockRegex = /^```(?:yaml)?\s*([\s\S]*?)\s*```$/i;
  const match = cleaned.match(codeBlockRegex);
  
  if (match) {
    return match[1].trim();
  }
  
  // Fallback cleanup if regex doesn't match perfectly but starts with ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:yaml)?\s*/i, '').replace(/\s*```$/, '');
  }
  
  return cleaned;
};

export const generateEspHomeYaml = async (prompt: string, currentYaml?: string): Promise<string> => {
  try {
    const fullPrompt = `
      ${currentYaml ? `Current YAML context:\n\`\`\`yaml\n${currentYaml}\n\`\`\`\n` : ''}
      User Request: ${prompt}
      
      Please generate the full valid ESPHome YAML configuration. 
      If you are modifying the context, return the updated full YAML.
      Ensure you handle the specific platform requirements (ESP8266 vs ESP32 vs Beken/bk72xx).
      Do not wrap the output in markdown code blocks (like \`\`\`yaml), just return the raw text content of the YAML so I can display it in an editor.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, // Keep it deterministic for code
      },
    });

    return cleanYamlResponse(response.text || "");
  } catch (error: any) {
    return handleGeminiError(error);
  }
};

export const fixEspHomeYaml = async (currentYaml: string, errorMessage: string): Promise<string> => {
  try {
    const fullPrompt = `
      Current YAML Configuration:
      \`\`\`yaml
      ${currentYaml}
      \`\`\`
      
      Error Log / Issue Description:
      ${errorMessage}
      
      Task: Fix the YAML configuration above to resolve the error. Return the full, corrected YAML.
      Do not wrap the output in markdown code blocks, just return the raw YAML text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: DEBUG_SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for precise fixes
      },
    });

    return cleanYamlResponse(response.text || "");
  } catch (error: any) {
    return handleGeminiError(error);
  }
};

const handleGeminiError = (error: any): string => {
  console.error("Gemini API Error:", error);

  const message = error.message || JSON.stringify(error);

  if (message.includes("401") || message.toLowerCase().includes("api key")) {
    return `# Error: Authentication Failed\n# The provided API Key is invalid or missing. Please check your configuration.`;
  }

  if (message.includes("429") || message.toLowerCase().includes("quota")) {
    return `# Error: Rate Limit Exceeded\n# You have sent too many requests in a short period. Please wait a moment and try again.`;
  }

  if (message.includes("503") || message.toLowerCase().includes("service unavailable")) {
    return `# Error: Service Unavailable\n# The AI service is currently experiencing high load. Please try again later.`;
  }

  if (message.toLowerCase().includes("safety")) {
      return `# Error: Content Blocked\n# The request was blocked by safety filters. Please try rephrasing your request.`;
  }

  return `# Error contacting Gemini API: ${message}\n# Please check the browser console for more details.`;
}