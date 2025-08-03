/**
 * Script untuk melakukan test upload menggunakan arrivalService.js
 */

// Menggunakan ES modules karena project dikonfigurasi dengan "type": "module"
import fs from 'fs';
import path from 'path';
import * as arrivalService from './services/arrivalService.js';

// Fungsi untuk menjalankan test upload
async function runTest() {
  try {
    
    console.log('=== TEST UPLOAD DENGAN CURL ===');
    // Mendapatkan perintah curl untuk testing
    const curlCommands = arrivalService.generateCurlTestCommand();
    console.log(curlCommands.instructions);
    
    console.log('\n=== TEST UPLOAD DENGAN JAVASCRIPT ===');
    console.log('Masukkan path file foto dan kartu vaksin sebagai argumen:');
    console.log('node --experimental-modules src/test-upload.js [path_foto] [path_kartu_vaksin]');
    
    // Cek apakah ada argumen path file
    const args = process.argv.slice(2);
    const facePhotoPath = args[0] || null;
    const vaccineCardPath = args[1] || null;
    
    if (facePhotoPath || vaccineCardPath) {
      console.log('\nMelakukan test upload dengan file:');
      if (facePhotoPath) console.log(`- Foto: ${facePhotoPath}`);
      if (vaccineCardPath) console.log(`- Kartu Vaksin: ${vaccineCardPath}`);
      
      // Validasi file
      if (facePhotoPath && !fs.existsSync(facePhotoPath)) {
        console.error(`Error: File foto tidak ditemukan di path ${facePhotoPath}`);
        return;
      }
      
      if (vaccineCardPath && !fs.existsSync(vaccineCardPath)) {
        console.error(`Error: File kartu vaksin tidak ditemukan di path ${vaccineCardPath}`);
        return;
      }
      
      // Melakukan test upload
      console.log('\nMengirim data...');
      const result = await arrivalService.testUploadFromJs(
        null, // Gunakan data sample
        facePhotoPath,
        vaccineCardPath
      );
      
      console.log('\nHasil test:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('\nTidak ada file yang disediakan, melakukan test tanpa file...');
      
      // Melakukan test upload tanpa file
      const result = await arrivalService.testUploadFromJs();
      
      console.log('\nHasil test:');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('Error saat menjalankan test:', error);
  }
}

runTest();