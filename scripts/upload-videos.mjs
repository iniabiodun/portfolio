import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// All video/gif files to upload to Vercel Blob
const videoFiles = [
  'Screen Recording 2025-12-03 at 19.48.29.mp4',
  'Fin Hero p5.js animation-social.mp4',
  'Aurora Borealis.mov',
  'Fin Voice Particles.mp4',
  'Fin Voice Product Page.gif',
  'Aivie.mp4',
  'Talking Sphere (1).mp4',
  'Decimals 1.mp4',
  'Decimals 2.mp4',
  'Decimals 3.mp4',
  'Screen Recording 2025-09-17 at 13.38.41.mov',
  'Smarty-coach.MP4',
  'Fin Voice.gif',
];

async function uploadVideos() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is not set.');
    console.log('\nTo set it up:');
    console.log('1. Create .env.local with: BLOB_READ_WRITE_TOKEN=your-token');
    console.log('2. Or run: export BLOB_READ_WRITE_TOKEN="your-token-here"');
    process.exit(1);
  }

  const uploadedUrls = {};
  let totalUploaded = 0;
  let totalFailed = 0;

  for (const filename of videoFiles) {
    const filePath = path.join(publicDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${filename} - file not found`);
      continue;
    }

    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);

    try {
      console.log(`📤 Uploading ${filename} (${sizeMB} MB)...`);
      
      // Use streaming for large files
      const fileStream = fs.createReadStream(filePath);
      const blob = await put(filename, fileStream, {
        access: 'public',
        token,
      });
      
      uploadedUrls[filename] = blob.url;
      console.log(`✅ Uploaded: ${blob.url}\n`);
      totalUploaded++;
    } catch (error) {
      console.error(`❌ Error uploading ${filename}:`, error.message);
      totalFailed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Uploaded: ${totalUploaded} files`);
  if (totalFailed > 0) console.log(`❌ Failed: ${totalFailed} files`);
  
  console.log('\n📁 Blob URLs (save these!):\n');
  for (const [filename, url] of Object.entries(uploadedUrls)) {
    console.log(`"${filename}":`);
    console.log(`  ${url}\n`);
  }
  
  // Save URLs to a JSON file for reference
  const outputPath = path.join(rootDir, 'blob-urls.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedUrls, null, 2));
  console.log(`\n💾 URLs saved to: blob-urls.json`);
  
  console.log('\n💡 Next steps:');
  console.log('Update your MDX files to use these Blob URLs instead of local paths.');
}

uploadVideos().catch(console.error);
