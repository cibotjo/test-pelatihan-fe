# Panduan Test Upload Data Kedatangan

Dokumen ini berisi panduan untuk melakukan test upload data kedatangan menggunakan fungsi-fungsi yang telah disediakan di `arrivalService.js`.

## Persiapan API Server

Sebelum melakukan test upload, pastikan API server sudah berjalan:

1. Buka terminal dan navigasikan ke direktori API server:

```bash
cd "/Users/joe/Jonatan/Pusdatik/Pelatihan FE/hc-bssn-ws-insecure-api"
```

2. Pastikan database PostgreSQL sudah berjalan dan sesuai dengan konfigurasi di file `.env.local`:

```
PORT=3000
DB_USER=joe
DB_HOST=localhost
DB_NAME=pelatihan_fe
DB_PASS=postgres
DB_PORT=5432
```

3. Jalankan API server dengan perintah:

```bash
npm run dev
```

API server akan berjalan di `http://localhost:3000`.

## Metode 1: Menggunakan Node.js Script

Untuk melakukan test upload menggunakan Node.js, ikuti langkah-langkah berikut:

1. Pastikan Node.js sudah terinstal di komputer Anda
2. Buka terminal dan navigasikan ke direktori root proyek (`hc-bssn-ws-web`)
3. Jalankan perintah berikut untuk melakukan test upload tanpa file:

```bash
node --experimental-modules src/test-upload.js
```

4. Untuk melakukan test upload dengan file, tambahkan path ke file foto dan kartu vaksin sebagai argumen:

```bash
node --experimental-modules src/test-upload.js /path/to/photo.jpg /path/to/vaccine_card.pdf
```

Contoh:

```bash
node --experimental-modules src/test-upload.js ./test-files/photo.jpg ./test-files/vaccine.pdf
```

## Metode 2: Menggunakan Browser

Untuk melakukan test upload menggunakan browser, ikuti langkah-langkah berikut:

1. Jalankan server development dengan perintah:

```bash
npm run dev
```

2. Buka file `src/test-upload.html` di browser Anda, atau navigasikan ke URL yang sesuai jika Anda menggunakan server development

3. Pilih file foto wajah dan kartu vaksin menggunakan form yang disediakan

4. Klik tombol "Test Upload" untuk mengirim data

5. Hasil test akan ditampilkan di bagian bawah halaman

## Metode 3: Menggunakan Curl

Untuk mendapatkan perintah curl yang dapat digunakan untuk test upload, jalankan script Node.js dan lihat output-nya:

```bash
node --experimental-modules src/test-upload.js
```

Script akan menampilkan perintah curl yang dapat Anda salin dan jalankan di terminal. Ada dua jenis perintah curl yang disediakan:

1. Perintah curl untuk upload tanpa file (menggunakan JSON)
2. Perintah curl untuk upload dengan file (menggunakan multipart/form-data)

Jangan lupa untuk mengganti path file dengan path yang sesuai di komputer Anda.

## Catatan Penting

- Pastikan server API sudah berjalan dan dapat diakses
- URL API default adalah `http://localhost:3000`, tetapi dapat diubah melalui variabel lingkungan `VITE_API_URL`
- File yang diupload harus sesuai dengan format yang diizinkan (JPG, PNG, atau PDF) dan ukurannya tidak melebihi 5MB
- Jika terjadi error, periksa console browser atau output terminal untuk informasi lebih lanjut