# Perbaikan Penanganan Error Upload File di Frontend

## Masalah

Aplikasi frontend mengalami error saat melakukan upload file ke endpoint `/api/arrivals` dengan pesan error:

```
ArrivalForm.vue:203 
POST http://localhost:3000/api/arrivals 500 (Internal Server Error)
Promise.then
submitForm @ ArrivalForm.vue:203
(anonymous) @ ArrivalForm.vue:17
```

Masalah ini terjadi karena direktori `uploads/` yang digunakan untuk menyimpan file di backend tidak ada atau tidak dapat diakses.

## Solusi

Beberapa perbaikan telah diterapkan di frontend untuk menangani error dengan lebih baik:

### 1. Penambahan Interceptor di api.js

File `src/services/api.js` telah diperbarui dengan menambahkan interceptor untuk menangani error response. Interceptor ini akan:

- Mencatat error ke console dengan informasi yang lebih detail
- Menambahkan penanganan khusus untuk error 500 pada endpoint arrivals
- Memberikan informasi yang lebih spesifik tentang kemungkinan penyebab error

### 2. Perbaikan di ArrivalForm.vue

File `src/pages/ArrivalForm.vue` telah diperbarui untuk:

- Menampilkan pesan error yang lebih spesifik berdasarkan jenis error
- Memastikan `isSubmitting` diatur kembali ke `false` setelah validasi gagal
- Menambahkan blok `finally` untuk memastikan `isSubmitting` selalu diatur kembali ke `false`
- Menangani berbagai jenis error HTTP (400, 401, 403, 413, 500) dengan pesan yang sesuai

## Cara Menggunakan

Tidak ada perubahan dalam cara menggunakan aplikasi. Namun, jika terjadi error saat upload file, sekarang akan ditampilkan pesan yang lebih informatif yang dapat membantu pengguna atau administrator untuk mengatasi masalah.

## Catatan Tambahan

Untuk mengatasi masalah di sisi backend, pastikan:

1. Direktori `uploads/` ada di root project backend
2. Backend dijalankan dengan script `npm run start:safe` atau `npm run dev:safe` yang akan membuat direktori `uploads/` jika belum ada
3. Aplikasi backend memiliki izin untuk menulis ke direktori `uploads/`