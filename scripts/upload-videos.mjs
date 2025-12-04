import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

// Videos to upload (excluding ones already in .gitignore)
const videoFiles = [
  'Screen Recording 2025-12-03 at 19.48.29.mp4',
  'Fin Hero p5.js animation-social.mp4',
  'Aurora Borealis.mov',
];

async function uploadVideos() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  
  if (!token) {
    console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is not set.');
    console.log('\nTo set it up:');
    console.log('1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
    console.log('2. Add BLOB_READ_WRITE_TOKEN with your Blob store token');
    console.log('3. Or run: export BLOB_READ_WRITE_TOKEN="your-token-here"');
    process.exit(1);
  }

  const uploadedUrls = {};

  for (const filename of videoFiles) {
    const filePath = path.join(publicDir, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Skipping ${filename} - file not found`);
      continue;
    }

    try {
      console.log(`📤 Uploading ${filename}...`);
      const blob = await put(filename, fs.readFileSync(filePath), {
        access: 'public',
        token,
      });
      
      uploadedUrls[filename] = blob.url;
      console.log(`✅ Uploaded: ${blob.url}`);
    } catch (error) {
      console.error(`❌ Error uploading ${filename}:`, error.message);
    }
  }

  console.log('\n📋 Upload Summary:');
  console.log(JSON.stringify(uploadedUrls, null, 2));
  
  console.log('\n💡 Next steps:');
  console.log('Update your MDX files to use these URLs instead of local paths.');
  console.log('Example: Replace "/Screen%20Recording%202025-12-03%20at%2019.48.29.mp4"');
  console.log('         with the URL from the summary above.');
}

uploadVideos().catch(console.error);

