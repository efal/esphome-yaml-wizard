const fs = require('fs');
const path = require('path');

// Since we can't use sharp in this environment, we'll create a simple script
// that copies the base icon to different sizes
// In production, you would use sharp or another image processing library

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const sourceIcon = path.join(__dirname, '..', 'esphome_icon_512.png');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Icon generation script ready.');
console.log('Please manually copy and resize the base icon to the following sizes:');
sizes.forEach(size => {
    console.log(`- ${size}x${size} -> public/icons/icon-${size}x${size}.png`);
});

console.log('\nYou can use online tools like:');
console.log('- https://www.iloveimg.com/resize-image');
console.log('- https://squoosh.app/');
console.log('- Or install sharp: npm install sharp');
