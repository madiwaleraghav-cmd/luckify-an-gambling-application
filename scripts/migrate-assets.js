const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../../'); // Desktop/web tech
const OUTPUT_DIR = path.join(__dirname, '../public/sequence/roulette');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('Migrating assets...');

// Find all ezgif-frame-*.jpg files
const files = fs.readdirSync(SOURCE_DIR)
    .filter(file => file.startsWith('ezgif-frame-') && file.endsWith('.jpg'))
    .sort();

if (files.length === 0) {
    console.error('No source images found!');
    process.exit(1);
}

console.log(`Found ${files.length} frames.`);

// Copy and rename first 120 frames (or all if desired, staying with 120 for now per prompt)
// Actually, prompt says frame_0 to frame_N. Let's copy all of them but we will clamp to 120 in code if needed.
// Or better, let's copy exactly what we need. Code says 120 frames in prompt specs.
// But having more smoothness is better. Let's copy all 210 and just adjust FRAME_COUNT constant.

files.forEach((file, index) => {
    // ezgif-frame-001.jpg -> frame_0.jpg
    const srcPath = path.join(SOURCE_DIR, file);
    const destPath = path.join(OUTPUT_DIR, `frame_${index}.jpg`);
    fs.copyFileSync(srcPath, destPath);
});

console.log(`Copied ${files.length} frames to ${OUTPUT_DIR}`);
