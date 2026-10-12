# Simulasi Pemilu LIVE

Overlay lokal vertikal 1080 × 1920 dengan Three.js, HTML/CSS, Node.js dan WebSocket. Kedua kandidat sepenuhnya fiktif. Tidak ada koneksi TikTok, pembacaan chat/gift, API key, atau layanan berbayar.

## Menjalankan

Gunakan Node.js 22 atau lebih baru. Dari direktori proyek:

```powershell
npm install
npm start
```

- Preview dengan tautan kontrol: http://localhost:3000/preview
- Overlay bersih: http://localhost:3000/overlay
- Panel kontrol terpisah: http://localhost:3000/control

Biarkan terminal/server berjalan. Semua aset disajikan lokal setelah instalasi; tidak membutuhkan CDN. `npm run dev` juga menjalankan server yang sama. Port dapat diganti dengan `$env:PORT=3001` sebelum `npm start`.

## Menggunakan

1. Buka kontrol dan overlay pada komputer yang sama.
2. Mulai atau jeda timer 5 menit. Timer mencapai nol lalu berhenti otomatis.
3. Klik Mawar uji +1 pada kandidat tujuan; setiap klik adalah satu event dan tepat satu dukungan. Pemilihan kandidat aktif mengarahkan tombol pengiriman umum ke kandidat tersebut.
4. Reset putaran menghapus skor dan notifikasi, menjeda serta mengembalikan timer ke 05:00, dan menaikkan nomor putaran. Kandidat aktif dipertahankan.
5. Mawar boleh diuji saat timer dijeda atau selesai; timer mengatur tampilan waktu, bukan izin pemberian dukungan.

Persentase adalah bagian dari total dukungan. Keduanya 0% saat total nol. Petunjuk ketik 01/02 adalah tampilan untuk rancangan siaran; tidak ada chat yang dibaca pada tahap ini.

## TikTok LIVE Studio

Pada sumber Link/Browser yang tersedia, masukkan `http://localhost:3000/overlay` dan atur viewport sumber ke **1080 × 1920**. Sumber harus berjalan pada komputer yang sama dengan server. Gunakan `/control` di browser biasa untuk mengendalikan siaran. Browser memerlukan WebGL/hardware acceleration agar panggung tampil. Jika WebGL tidak tersedia, pesan fallback muncul dan skor HTML tetap berjalan.

Kompatibilitas sumber Link/Browser dan rendering WebGL **belum diuji langsung di TikTok LIVE Studio**. Preview hanya divalidasi di browser lokal. Tidak ada klaim integrasi gift aktif.

## State dan batasan

- Server menjadi pemilik skor, timer dan daftar ID event; broadcast setiap 200 ms serta setelah perintah.
- Event duplikat ditolak berdasarkan ID pada putaran saat ini. Nomor putaran menolak event terlambat setelah reset.
- Data hanya di memori proses. Refresh halaman tidak menghapusnya; menghentikan server menghapus seluruh sesi.
- Server terikat ke loopback `127.0.0.1`, bukan jaringan publik; tidak ada autentikasi admin. Ini alat lokal satu operator, bukan deployment publik.
- Saat koneksi putus, kontrol dinonaktifkan dan mencoba menyambung kembali. Perintah tidak diantrikan atau diulang; periksa skor sebelum mengirim ulang setelah gangguan. Snapshot terbaru dipulihkan saat tersambung, bukan seluruh riwayat animasi.
- Mawar terakhir ditampilkan sebagai notifikasi; animasi dibatasi maksimal 40 mawar bersamaan. Preferensi reduced motion mengurangi gerak.

## Validasi

```powershell
npm test
npm run build
```

Tes mencakup skor +1, deduplikasi, reset, penolakan event putaran lama, timer start/pause/expiry, validasi kandidat, HTTP aset, dan sinkronisasi dua klien WebSocket. Tes integrasi memakai port 3011.

Build menghasilkan `dist/app.js` untuk memvalidasi bundel browser. Server lokal menyajikan modul sumber dan Three.js dari node_modules; dist bukan situs mandiri karena aplikasi tetap memerlukan server WebSocket.

## Berkas

- `server.js`: HTTP lokal dan WebSocket.
- `session.js`: state sesi dan validasi perintah.
- `public/index.html`, `public/app.js`, `public/style.css`: overlay, panggung, preview, kontrol.
- `tests/`: tes logika dan integrasi.
- `scripts/build.js`: pemeriksaan bundel.
- `package.json`, `package-lock.json`, `.gitignore`: dependensi dan perintah proyek.
