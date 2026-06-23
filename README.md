# Aplikasi Penjana One Page Report (OPR) - SK Kubang Gajah

Aplikasi web ringkas tanpa kerangka kerja (pure HTML/CSS/JS) untuk memudahkan penyediaan Laporan Pelaksanaan Program/Aktiviti (One Page Report - OPR) bagi Sekolah Kebangsaan Kubang Gajah, Malaysia.

---

## Ciri-ciri Utama

- **Wizard 3-Langkah**: Antaramuka berperingkat yang mesra pengguna (Maklumat, Kandungan & Gambar).
- **Sistem Seretan Gambar (Drag & Drop)**: Memudahkan proses muat naik maksimum 6 keping gambar dengan pratonton kedudukan nisbah 1:1.
- **Reka Bentuk Beresolusi Tinggi**: Kemas, bertatatingkat dan berpandukan *design.md* (Expo system tokens).
- **Mesra Cetakan (Print-Optimized)**: Menghasilkan fail laporan A4 satu halaman sahaja berserta pengoptimuman susun atur grid 2-kolum untuk fail PDF.
- **Bekerja Luar Talian (Offline First)**: Boleh dijalankan terus dari fail tempatan pelayar (`file://`) tanpa memerlukan pelayan backend.

---

## Struktur Fail
```
opr-sk-kubang-gajah/
├── index.html          ← Struktur utama aplikasi & antaramuka
├── README.md           ← Panduan penggunaan (fail ini)
├── assets/
│   ├── logo.jpg        ← Fail logo fizikal (cth: logo.png atau logo.jpg)
│   └── logo-b64.js     ← Fail base64 untuk membenarkan penggunaan luar talian / file://
├── css/
│   ├── tokens.css      ← Pemboleh ubah reka bentuk (warna, jejari, jarak)
│   ├── form.css        ← Gaya antaramuka borang dan pemilih langkah
│   ├── opr.css         ← Gaya kad pratonton laporan
│   └── print.css       ← Gaya sedia-cetak PDF / Kertas A4
└── js/
    ├── form.js         ← Logik stepper, kawalan input dan pengesahan borang
    ├── photos.js       ← Pengurusan fail muat naik gambar dan grid thumbnail
    ├── render.js       ← Pembina struktur DOM Laporan OPR
    └── print.js        ← Logik pembukaan tetingkap cetakan
```

---

## Panduan Penggunaan

### 1. Cara Menjalankan Aplikasi

1. Dapatkan folder `opr-sk-kubang-gajah`.
2. Buka fail `index.html` dengan klik dua kali di mana-mana pelayar web moden (Chrome, Firefox, Safari, Edge).
3. *Nota*: Memandangkan ia menggunakan ES6 Modules (`type="module"`), sesetengah pelayar mengetatkan sekatan keselamatan pada fail tempatan (`file://`). Jika borang tidak berfungsi, jalankan aplikasi menggunakan pelayan HTTP tempatan (contoh: *VS Code Live Server* atau arahan Python di terminal: `python -m http.server`).

### 2. Cara Mengkonfigurasi Logo Sekolah
Untuk membolehkan logo dipaparkan di dalam fail cetakan PDF walaupun dijalankan secara luar talian (tanpa isu keselamatan CORS), logo sekolah ditukar kepada format **Base64 string**.

Sila ikuti langkah di bawah:

1. Pastikan logo sekolah anda diletakkan di dalam folder `assets/logo.jpg` (atau `assets/logo.png`).
2. Buka fail `index.html` di pelayar web, kemudian buka **Developer Console** (tekan `F12` atau klik kanan > `Inspect` > tab `Console`).
3. Salin dan jalankan kod JavaScript berikut di dalam konsol tersebut:
   ```javascript
   (function() {
     const input = document.createElement('input');
     input.type = 'file';
     input.accept = 'image/*';
     input.onchange = e => {
       const file = e.target.files[0];
       const reader = new FileReader();
       reader.onload = evt => console.log(evt.target.result);
       reader.readAsDataURL(file);
     };
     input.click();
   })();
   ```
4. Apabila pemilih fail muncul, pilih gambar logo sekolah (`assets/logo.png`) anda.
5. Konsol akan memaparkan teks panjang bermula dengan `data:image/png;base64,...`.
6. Salin teks tersebut, kemudian buka fail `assets/logo-b64.js` dan tampalkan ia ke dalam pemboleh ubah `LOGO_B64`:
   ```javascript
   export const LOGO_B64 = "TAMPAL_KOD_BASE64_DI_SINI";
   ```
7. Simpan fail tersebut. Kini logo sekolah anda akan dipaparkan secara automatik di bahagian atas laporan.
