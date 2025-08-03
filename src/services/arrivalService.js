/**
 * Service untuk menangani operasi terkait kedatangan wisatawan
 */
import axios from 'axios';

// Konstanta untuk validasi
const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[0-9]+$/,
  PASSPORT_REGEX: /^[A-Z0-9]+$/i,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
};

/**
 * Validasi data form kedatangan
 * @param {Object} formData - Data form yang akan divalidasi
 * @returns {Object} - Hasil validasi {isValid, errors}
 */
export const validateArrivalForm = (formData) => {
  const errors = [];
  
  // Validasi field yang wajib diisi
  const requiredFields = [
    { key: 'full_name', label: 'Nama Lengkap' },
    { key: 'passport_no', label: 'Nomor Paspor' },
    { key: 'nationality', label: 'Kebangsaan' },
    { key: 'gender', label: 'Jenis Kelamin' },
    { key: 'birth_date', label: 'Tanggal Lahir' },
    { key: 'phone_number', label: 'Nomor Telepon' },
    { key: 'email', label: 'Email' }
  ];
  
  requiredFields.forEach(field => {
    if (!formData[field.key]) {
      errors.push(`${field.label} wajib diisi`);
    }
  });
  
  // Validasi format email
  if (formData.email && !VALIDATION.EMAIL_REGEX.test(formData.email)) {
    errors.push('Format email tidak valid');
  }
  
  // Validasi format nomor telepon
  if (formData.phone_number && !VALIDATION.PHONE_REGEX.test(formData.phone_number)) {
    errors.push('Format nomor telepon tidak valid (hanya angka dan tanda +)');
  }
  
  // Validasi format nomor paspor
  if (formData.passport_no && !VALIDATION.PASSPORT_REGEX.test(formData.passport_no)) {
    errors.push('Format nomor paspor tidak valid (hanya huruf dan angka)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validasi file upload
 * @param {File} file - File yang akan divalidasi
 * @returns {Object} - Hasil validasi {isValid, error}
 */
export const validateFile = (file) => {
  if (!file) return { isValid: true };
  
  // Validasi tipe file
  if (!VALIDATION.ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipe file tidak diizinkan. Gunakan format JPG, PNG, atau PDF.'
    };
  }
  
  // Validasi ukuran file
  if (file.size > VALIDATION.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'Ukuran file terlalu besar. Maksimal 5MB.'
    };
  }
  
  return { isValid: true };
};

/**
 * Mengirim data kedatangan ke API
 * @param {Object} formData - Data form yang akan dikirim
 * @param {File} facePhoto - File foto wajah
 * @param {File} vaccineCard - File kartu vaksin
 * @returns {Promise} - Promise hasil pengiriman data
 */
export const submitArrivalData = async (formData, facePhoto, vaccineCard) => {
  try {
    // Validasi data form
    const validation = validateArrivalForm(formData);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      };
    }
    
    // Validasi file foto wajah
    if (facePhoto) {
      const facePhotoValidation = validateFile(facePhoto);
      if (!facePhotoValidation.isValid) {
        return {
          success: false,
          errors: [facePhotoValidation.error]
        };
      }
    }
    
    // Validasi file kartu vaksin
    if (vaccineCard) {
      const vaccineCardValidation = validateFile(vaccineCard);
      if (!vaccineCardValidation.isValid) {
        return {
          success: false,
          errors: [vaccineCardValidation.error]
        };
      }
    }
    
    // Persiapkan FormData untuk upload
    const data = new FormData();
    
    // Tambahkan data form ke FormData
    Object.keys(formData).forEach(key => {
      // Sanitasi input untuk mencegah XSS
      let value = formData[key];
      data.append(key, value);
    });
    
    // Tambahkan file jika ada
    if (facePhoto) {
      data.append('face_photo', facePhoto);
    }
    
    if (vaccineCard) {
      data.append('vaccine_card', vaccineCard);
    }
    
    // Tambahkan timestamp untuk mencegah replay attack
    data.append('timestamp', Date.now());
    
    // Gunakan variabel lingkungan atau konfigurasi untuk URL API
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    // Kirim data dengan CSRF token jika tersedia
    const response = await axios.post(`${apiBaseUrl}/api/arrivals`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest' // Untuk identifikasi AJAX request
      },
      withCredentials: true // Untuk mengirim cookies (termasuk CSRF token)
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error submitting arrival data:', error);
    
    // Tangani error berdasarkan tipe
    if (error.response) {
      // Server merespons dengan status error
      return {
        success: false,
        errors: [error.response.data.message || 'Terjadi kesalahan pada server'],
        statusCode: error.response.status
      };
    } else if (error.request) {
      // Request dibuat tapi tidak ada respons
      return {
        success: false,
        errors: ['Tidak dapat terhubung ke server. Periksa koneksi internet Anda.']
      };
    } else {
      // Error lainnya
      return {
        success: false,
        errors: ['Terjadi kesalahan saat mengirim data. Silakan coba lagi.']
      };
    }
   }
 };

/**
 * Contoh penggunaan fungsi test upload
 * 
 * Contoh 1: Menghasilkan perintah curl untuk testing
 * ```javascript
 * import { generateCurlTestCommand } from './services/arrivalService';
 * 
 * // Mendapatkan perintah curl untuk testing
 * const curlCommands = generateCurlTestCommand();
 * 
 * // Menampilkan instruksi
 * console.log(curlCommands.instructions);
 * 
 * // Atau menggunakan perintah spesifik
 * console.log('Perintah curl tanpa file:');
 * console.log(curlCommands.basicCommand);
 * ```
 * 
 * Contoh 2: Melakukan test upload dari browser
 * ```javascript
 * import { testUploadFromJs, getSampleArrivalData } from './services/arrivalService';
 * 
 * // Mendapatkan file dari input element
 * const facePhotoInput = document.getElementById('face-photo-input');
 * const vaccineCardInput = document.getElementById('vaccine-card-input');
 * 
 * // Mendapatkan data form (bisa menggunakan data sample atau data kustom)
 * const formData = getSampleArrivalData();
 * // Atau data kustom dari form
 * // const formData = {
 * //   full_name: document.getElementById('full-name').value,
 * //   // ... data lainnya
 * // };
 * 
 * // Melakukan test upload
 * const handleTestUpload = async () => {
 *   try {
 *     const result = await testUploadFromJs(
 *       formData,
 *       facePhotoInput.files[0],
 *       vaccineCardInput.files[0]
 *     );
 *     
 *     if (result.success) {
 *       console.log('Upload berhasil:', result.data);
 *     } else {
 *       console.error('Upload gagal:', result.errors);
 *     }
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * };
 * ```
 * 
 * Contoh 3: Melakukan test upload dari Node.js
 * ```javascript
 * import { testUploadFromJs } from './services/arrivalService';
 * 
 * // Path ke file lokal
 * const facePhotoPath = './path/to/photo.jpg';
 * const vaccineCardPath = './path/to/vaccine_card.pdf';
 * 
 * // Melakukan test upload
 * const runTest = async () => {
 *   try {
 *     const result = await testUploadFromJs(
 *       null, // Gunakan data sample
 *       facePhotoPath,
 *       vaccineCardPath
 *     );
 *     
 *     console.log('Hasil test:', result);
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * };
 * 
 * runTest();
 * ```

/**
 * Contoh data untuk form kedatangan
 * @returns {Object} - Data contoh untuk form kedatangan
 */
export const getSampleArrivalData = () => {
  return {
    full_name: 'John Smith',
    passport_no: 'AB123456',
    nationality: 'Australia',
    gender: 'L',
    birth_date: '1990-01-15',
    phone_number: '+61412345678',
    email: 'john.smith@example.com',
    address_in_indonesia: 'Hotel Mulia, Jl. Asia Afrika No. 6, Jakarta',
    flight_info: 'Garuda Indonesia GA-715',
    arrival_datetime: '2023-12-15T14:30',
    departure_city: 'Sydney',
    destination_city: 'Jakarta',
    health_info: 'Tidak ada kondisi kesehatan khusus',
    emergency_contact_name: 'Jane Smith',
    emergency_contact_phone: '+61498765432'
  };
};

/**
 * Menghasilkan contoh perintah curl untuk testing upload data kedatangan
 * @param {string} apiUrl - URL API yang akan digunakan (opsional)
 * @returns {string} - Perintah curl untuk testing
 */
export const generateCurlTestCommand = (apiUrl = null) => {
  const sampleData = getSampleArrivalData();
  // Handle both browser and Node.js environments
  let baseUrl = apiUrl || 'http://localhost:3000';
  try {
    // Try to access import.meta.env (works in browser/Vite environment)
    if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
      baseUrl = import.meta.env.VITE_API_URL;
    }
  } catch (e) {
    // Ignore error in Node.js environment
  }
  const endpoint = `${baseUrl}/api/arrivals`;
  
  // Membuat string JSON dari sample data
  const jsonData = JSON.stringify(sampleData);
  
  // Membuat perintah curl untuk testing tanpa file
  const curlCommandBasic = `curl -X POST \
  "${endpoint}" \
  -H "Content-Type: application/json" \
  -H "X-Requested-With: XMLHttpRequest" \
  --data '${jsonData}'`;
  
  // Membuat perintah curl untuk testing dengan file
  const curlCommandWithFiles = `curl -X POST \
  "${endpoint}" \
  -H "X-Requested-With: XMLHttpRequest" \
  -F "full_name=${sampleData.full_name}" \
  -F "passport_no=${sampleData.passport_no}" \
  -F "nationality=${sampleData.nationality}" \
  -F "gender=${sampleData.gender}" \
  -F "birth_date=${sampleData.birth_date}" \
  -F "phone_number=${sampleData.phone_number}" \
  -F "email=${sampleData.email}" \
  -F "address_in_indonesia=${sampleData.address_in_indonesia}" \
  -F "flight_info=${sampleData.flight_info}" \
  -F "arrival_datetime=${sampleData.arrival_datetime}" \
  -F "departure_city=${sampleData.departure_city}" \
  -F "destination_city=${sampleData.destination_city}" \
  -F "health_info=${sampleData.health_info}" \
  -F "emergency_contact_name=${sampleData.emergency_contact_name}" \
  -F "emergency_contact_phone=${sampleData.emergency_contact_phone}" \
  -F "timestamp=${Date.now()}" \
  -F "face_photo=@/path/to/your/photo.jpg" \
  -F "vaccine_card=@/path/to/your/vaccine_card.pdf"`;
  
  return {
    basicCommand: curlCommandBasic,
    withFilesCommand: curlCommandWithFiles,
    instructions: `
Untuk melakukan test upload dengan curl:

1. Tanpa file (JSON):
${curlCommandBasic}

2. Dengan file (multipart/form-data):
${curlCommandWithFiles}

Catatan:
- Ganti "/path/to/your/photo.jpg" dengan path file foto yang ingin diupload
- Ganti "/path/to/your/vaccine_card.pdf" dengan path file kartu vaksin yang ingin diupload
- Pastikan file yang diupload sesuai dengan format yang diizinkan (JPG, PNG, atau PDF)
- Pastikan ukuran file tidak melebihi 5MB
`
  };
};

/**
 * Fungsi untuk melakukan test upload langsung dari JavaScript
 * @param {Object} customData - Data kustom (opsional, jika tidak disediakan akan menggunakan sample data)
 * @param {string|File} facePhotoPath - Path ke file foto wajah atau File object (opsional)
 * @param {string|File} vaccineCardPath - Path ke file kartu vaksin atau File object (opsional)
 * @param {string} apiUrl - URL API yang akan digunakan (opsional)
 * @returns {Promise} - Promise hasil test upload
 */
export const testUploadFromJs = async (customData = null, facePhotoPath = null, vaccineCardPath = null, apiUrl = null) => {
  try {
    // Gunakan data kustom atau sample data
    const formData = customData || getSampleArrivalData();
    
    // Buat FormData object
    const data = new FormData();
    
    // Tambahkan data form ke FormData
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    // Tambahkan timestamp
    data.append('timestamp', Date.now());
    
    // Tambahkan file jika disediakan
     if (facePhotoPath || vaccineCardPath) {
       // Cek apakah di lingkungan browser atau Node.js
       if (typeof window === 'undefined') {
         // Node.js environment
         console.log('Menambahkan file dari path lokal (Node.js)');
         try {
           const fs = require('fs');
           
           if (facePhotoPath) {
             if (typeof facePhotoPath === 'string') {
               // Path string disediakan
               const facePhotoFile = fs.readFileSync(facePhotoPath);
               data.append('face_photo', new Blob([facePhotoFile]), facePhotoPath.split('/').pop());
             } else {
               // File object disediakan
               data.append('face_photo', facePhotoPath);
             }
           }
           
           if (vaccineCardPath) {
             if (typeof vaccineCardPath === 'string') {
               // Path string disediakan
               const vaccineCardFile = fs.readFileSync(vaccineCardPath);
               data.append('vaccine_card', new Blob([vaccineCardFile]), vaccineCardPath.split('/').pop());
             } else {
               // File object disediakan
               data.append('vaccine_card', vaccineCardPath);
             }
           }
         } catch (err) {
           console.error('Error saat membaca file:', err);
           return {
             success: false,
             errors: ['Gagal membaca file lokal. Pastikan path file benar.']
           };
         }
       } else {
         // Browser environment
         if (facePhotoPath) {
           data.append('face_photo', facePhotoPath);
         }
         
         if (vaccineCardPath) {
           data.append('vaccine_card', vaccineCardPath);
         }
       }
     }
    
    // Handle both browser and Node.js environments
    let baseUrl = apiUrl || 'http://localhost:3000';
    try {
      // Try to access import.meta.env (works in browser/Vite environment)
      if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
        baseUrl = import.meta.env.VITE_API_URL;
      }
    } catch (e) {
      // Ignore error in Node.js environment
    }
    
    // Kirim data
    const response = await axios.post(`${baseUrl}/api/arrivals`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest'
      },
      withCredentials: true
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error testing upload:', error);
    
    if (error.response) {
      return {
        success: false,
        errors: [error.response.data.message || 'Terjadi kesalahan pada server'],
        statusCode: error.response.status
      };
    } else if (error.request) {
      return {
        success: false,
        errors: ['Tidak dapat terhubung ke server. Periksa koneksi internet Anda.']
      };
    } else {
      return {
        success: false,
        errors: ['Terjadi kesalahan saat mengirim data. Silakan coba lagi.']
      };
    }
  }
};