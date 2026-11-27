# Panduan testing dan demo Aku Mw Magang

Jalankan dari atas ke bawah dalam satu sesi browser. Kamu akan mengikuti **Nusantara Cloud Tech** dari Wishlist sampai Offer, lalu membandingkannya dengan **Bintang Commerce**. Setiap langkah punya hasil yang bisa kamu cek langsung di layar.

## Persiapan

1. Di terminal folder proyek, jalankan `npm run dev`. Kalau ini checkout baru dan dependensi belum terpasang, jalankan `npm ci` dulu. Buka alamat **Local** yang dicetak Vite.
2. Pakai jendela privat baru dengan seluruh jendela privat lama sudah ditutup, atau profil browser khusus testing. Gunakan alamat dan port yang sama sepanjang pengujian. Dengan begitu kamu bisa menguji hapus dan refresh tanpa menyentuh lamaran di profil harian.
3. Cek angka awal di bagian atas: **Total Lamaran 4**, **Response Rate 75%**, **Interview Rate 50%**, **Offer Diterima 0**. Catat angka **Rawan Ghosting** sebagai pembanding karena nilainya mengikuti tanggal pengujian.
4. Di layar kecil, buka **Profil skill & sumber lowongan** untuk mengakses skill dan pilihan data. Navigasi **Pipeline lamaran** dan **Perbandingan offer** tersedia lewat tombol menu. Di desktop, navigasi ada di sebelah kiri.

## 1. Muat data, putuskan koneksi, lalu pulihkan

1. Buka **Eksplorasi lowongan** dengan **Remotive API (Live)**. Harapannya muncul **Memuat Lowongan** lalu daftar pekerjaan. Jika loading terlalu cepat untuk diamati, perlambat koneksi di DevTools → **Network**, lalu pindah sumber dari lokal ke live.
2. Setelah halaman terbuka, pilih **Dataset Magang ID (Lokal)**. Pastikan jumlahnya **15 dari 15 lowongan**. Di DevTools → **Network**, pilih **Offline**. Tanpa memuat ulang halaman, pilih **Remotive API (Live)** supaya aplikasi benar-benar membuat permintaan baru.
3. **Lulus jika** muncul pesan gagal beserta **Coba Lagi** dan **Gunakan Fallback Lokal**. Klik **Coba Lagi** selagi offline. Permintaan diulang dan halaman tetap menampilkan pilihan pemulihan.
4. Kembalikan Network ke **No throttling** sebelum klik **Gunakan Fallback Lokal**. File JSON lokal juga dimuat melalui HTTP. Hasilnya harus kembali **15 dari 15**. Biarkan sumber lokal aktif untuk langkah berikutnya. Jika Remotive juga gagal saat online, catat uji live tersendiri dan lanjutkan skenario lain memakai dataset lokal.

## 2. Buktikan Skill Match berubah saat profil diedit

1. Di kolom pencarian, ketik `AwanMerdeka`. Dengan skill awal, lowongan **DevOps & Cloud Infrastructure Intern** memiliki **20% cocok** berwarna merah. Hanya Git yang cocok dari lima skill.
2. Di profil, masukkan `Docker` lalu klik **Tambah**. Tanpa refresh, skor menjadi **40%** berwarna kuning. Docker berpindah dari **Belum di profil** ke **Skill cocok**.
3. Tambahkan `docker` sekali lagi. Pesan duplikat harus muncul, jumlah skill dan skor tetap. Kosongkan kolom skill lalu klik **Tambah** untuk mengecek validasi input kosong.
4. Tekan **F5**. Pilih lagi sumber lokal dan cari AwanMerdeka. Docker masih ada dan skornya tetap **40%**. Klik ikon hapus di samping Docker. Skor kembali **20%**. Kosongkan pencarian.
5. Cek **Nusantara Cloud Tech**. Kelima skill cocok sehingga badge **100%** berwarna hijau. Kamu sekarang sudah melihat ketiga warna di data nyata.

## 3. Cari lowongan, gabungkan filter, dan simpan ke Wishlist

1. Klik judul halaman lalu tekan **/**. Kursor harus masuk ke kolom pencarian dan ikon pencarian tetap terpisah dari teks. Ketik cepat `Docker`. Saat mengetik muncul **Mencari…** dan daftar diperbarui sekitar **400 ms setelah ketikan terakhir**. Dengan dataset lokal hasil akhirnya **5 dari 15**.
2. Dengan kata Docker tetap terisi, pilih kategori **Data**. Hasilnya hanya **Laju Logistics Tech** dan **Nalar AI Labs**. Ganti urutan antara **Match Tertinggi**, **Match Terendah**, dan **Judul A–Z**. Dengan skill awal, Nalar memiliki 40% dan Laju 0%, jadi posisi pertama berubah sesuai pilihan.
3. Ganti kata pencarian menjadi `zzzz-tidak-ada`. Harus tampil **Tidak ada lowongan yang cocok**. Klik **Reset Pencarian & Filter**. Semua 15 kembali. Pilih **Match Tertinggi**.
4. Cari `Nusantara Cloud Tech`. Arahkan pointer ke baris lowongan, lalu arahkan fokus dengan Tab ke tombolnya. Baris mendapat sorotan dan teks tetap terbaca. Klik **Simpan ke Wishlist** satu kali.
5. **Lulus jika** tombol berubah menjadi **Sudah Dilamar**, tidak bisa diklik lagi, dan **Total Lamaran menjadi 5**. Buka **Pipeline lamaran** dan temukan Nusantara dengan status **Wishlist** serta Skill Match **100%**.

## 4. Uji form manual dan fokus saat input salah

1. Klik **Catat lamaran** (di HP **Catat**), lalu **Simpan Lamaran** dengan form kosong. Kursor harus pindah ke kolom perusahaan. Setelah perusahaan diisi, coba simpan lagi. Fokus harus berpindah ke posisi yang masih kosong.
2. Uji duplikat dengan perusahaan `nusantara cloud tech`, posisi `frontend engineering intern (react & typescript)`, dan required skills `React, CSS`. Biarkan status **WISHLIST**. Klik **Simpan Lamaran**. Pasangan yang sudah disimpan di langkah 3 harus ditolak walaupun kapitalisasinya berbeda. Fokus kembali ke perusahaan dan total tetap **5**.
3. Dalam form yang sama, ganti perusahaan menjadi `Studio Uji`, posisi `QA Intern`, mode **Onsite**, dan status awal **APPLIED**. Kolom versi CV dan tanggal melamar muncul. Coba simpan tanpa CV. Setelah muncul error, isi `CV-QA-v1.pdf`, kosongkan tanggal, dan simpan lagi. Kali ini fokus harus pindah ke tanggal.
4. Isi tanggal hari ini dan klik **Simpan Lamaran**. Modal tertutup, Pipeline menampilkan **Studio Uji**, status **Applied**, mode **Onsite**, dan CV yang tadi diisi. **Total Lamaran menjadi 6**. Di **Detail & Prep**, riwayat mencatat pembuatan lamaran.

## 5. Pindahkan Nusantara dari Wishlist dan uji ghosting

1. Buka **Detail & Prep** milik **Nusantara Cloud Tech**. Dari Wishlist, satu-satunya tujuan adalah **Applied**. Pilih Applied lalu **Konfirmasi Pindah Status** dengan CV kosong. Status tetap Wishlist. Isi `CV-Frontend-v1.pdf` dan tanggal hari ini, lalu konfirmasi. Riwayat bertambah dan kartu menampilkan versi CV.
2. Tutup detail. Catat angka **Rawan Ghosting**, lalu klik **Simulasi +15 Hari** pada Nusantara. **Lulus jika** status tetap Applied, muncul badge **Rawan Ghosting**, dan angka dashboard naik **1**.
3. Gabungkan pencarian Pipeline `CV-Frontend-v1.pdf`, filter **Applied**, dan **Hanya Rawan Ghosting**. Hanya Nusantara yang terlihat. Ganti status ke **Offer** untuk memunculkan keadaan kosong. Klik **Reset Filter** agar semua lamaran kembali.
4. Buka detail Nusantara dan konfirmasi **Screening**. Karena waktu perubahan status baru saja diperbarui, badge risiko hilang dan statistik ghosting turun kembali. Pilih **Interview** lalu konfirmasi tanpa jadwal. Pesan validasi muncul dan status tetap Screening. Lanjutkan dengan jadwal di langkah 6.

## 6. Buktikan batas bentrok 60 menit dan cakupan filter

1. Pada Nusantara, isi jadwal **28 November 2026 pukul 11.00** lalu konfirmasi **Interview**. Tanggal ini sengaja sama dengan dua interview bawaan, jadi gunakan tanggal tersebut meski demo berlangsung pada hari lain.
2. Tutup detail dan baca **nama pasangan** di banner **Peringatan Jadwal Interview Bentrok**. Harus ada tepat dua pasangan berikut.

   | Pasangan pada 28 November | Selisih | Hasil |
   |---|---:|---|
   | Garuda FinTech 10.00 dan Bintang Commerce 10.30 | 30 menit | Muncul |
   | Bintang Commerce 10.30 dan Nusantara Cloud Tech 11.00 | 30 menit | Muncul |
   | Garuda FinTech 10.00 dan Nusantara Cloud Tech 11.00 | 60 menit | Tidak muncul |

3. Filter Pipeline ke **Applied**. Kartu interview tersembunyi, tetapi dua pasangan pada banner tetap ada. Pilih **Interview**, lalu urutan **Jadwal Interview Terdekat**. Dari atas, hasilnya **Garuda → Bintang → Nusantara**. Klik **Reset Filter** dan kembalikan urutan ke **Terbaru Diupdate**.

## 7. Checklist, riwayat aktivitas, dan persistensi

1. Di **Detail & Prep** Nusantara, verifikasi riwayat pembuatan dan tiga perubahan status sampai Interview. Untuk mengukur progres tepat **1/2**, hapus dua tugas bawaan **di lamaran uji Nusantara ini** memakai ikon hapus per item. Progres mulai dari **0/0**.
2. Tambahkan `Review portofolio` dan `Tes mikrofon` lewat **Tambah tugas persiapan baru…**. Centang Review portofolio. Detail dan kartu Pipeline harus sama-sama menunjukkan **1/2**. Lepas centangnya untuk melihat **0/2**, lalu centang lagi.
3. Isi **Tambah catatan manual…** dengan `Siap demo teknis` dan klik **Catat**. Tekan **F5**, buka kembali **Pipeline lamaran → Nusantara → Detail & Prep**. Pastikan status Interview, versi CV, jadwal, dua item, centang **1/2**, dan catatan masih ada. Buka detail Garuda dan pastikan checklist bawaannya tetap **3/4**.

## 8. Jalankan timer dan periksa saat modal ditutup

1. Buka **Detail & Prep → Latihan Interview** pada Nusantara. Awalnya **Soal 1 / 6**, waktu **02:00**. Klik **Start**, tunggu sekitar tiga detik, lalu **Jeda**. Angka sekitar **01:57** harus diam selama dijeda.
2. Klik **Start** untuk melanjutkan, lalu **Reset**. Waktu kembali ke **02:00** dan berhenti. Jalankan lagi, klik **Soal Berikutnya**. Pertanyaan berubah, waktu kembali **02:00**. Teruskan sampai soal keenam dan cek klik berikutnya kembali ke soal pertama.
3. Buka DevTools → **Console**. Dengan timer berjalan, tutup modal melalui tombol ×, lalu buka lagi **Detail & Prep → Latihan Interview**. Timer mulai dalam keadaan berhenti pada **02:00**. Klik Start sambil melihat jam selama lima detik. Waktu harus mendekati **01:55**, dan tidak muncul error baru terkait timer.
4. Untuk menguji waktu habis, biarkan tab aktif sampai **00:00**. Pesan **Waktu habis!** muncul, hitungan berhenti di nol, dan **Mulai Ulang** memulai sesi dua menit lagi.

## 9. Uji status final, statistik, dan Offer Comparator

1. Buka **Perbandingan offer**. Saat ini belum ada offer, sehingga muncul **Belum cukup offer untuk dibandingkan**. Kembali ke Pipeline. Di detail **Studio Uji**, jalankan **Applied → Ghosted → Screening → Rejected**. Klik **Konfirmasi Pindah Status** setiap kali. Dari Ghosted hanya tersedia Screening. Setelah Rejected, opsi pindah status sudah tertutup.
2. Pada **Bintang Commerce**, pilih **Offer**. Coba gaji `0` dan konfirmasi. Status harus tetap Interview. Ganti menjadi `6000000`, pilih **Remote**, lalu konfirmasi. Kembali ke comparator. Pesan minimal dua offer masih muncul, sekarang dengan jumlah **1**.
3. Pada **Nusantara Cloud Tech**, ubah Interview menjadi **Offer** dengan gaji `4500000` dan mode **Hybrid**. Cek bahwa Offer bersifat final. Banner bentrok sekarang hilang karena hanya Garuda yang masih Interview.
4. Di **Perbandingan offer**, periksa kedua perusahaan pada pilihan A dan B. Satu offer tidak bisa dipilih di kedua sisi. Cocokkan hasil per perusahaan, karena posisi kiri dan kanan bisa berbeda.

   | Offer | Poin gaji (maks. 50) | Poin mode (maks. 25) | Poin skill (maks. 25) | Total di layar |
   |---|---:|---:|---:|---:|
   | Bintang Commerce | 50,0 | Remote 100 → 25,0 | 4 dari 5 cocok → 20,0 | **95,0** |
   | Nusantara Cloud Tech | 37,5 | Hybrid 75 → 18,8 | 5 dari 5 cocok → 25,0 | **81,3** |

   **Rekomendasi Terbaik** harus muncul pada Bintang. Gaji tertinggi dari seluruh offer di sesi ini adalah Rp6.000.000. Untuk Nusantara, perhitungan sebelum pembulatan adalah `(4.500.000 / 6.000.000 × 50) + (75 × 0,25) + (100 × 0,25) = 81,25`.

5. Di Pipeline, pilih filter **Offer**, urutkan **Offer Tertinggi**. Bintang harus di atas Nusantara. Dashboard tetap menghitung seluruh data: **Total Lamaran 6**, **Response Rate 83%** (5/6), **Interview Rate 50%** (3/6), **Offer Diterima 2**. Untuk angka Rawan Ghosting, cocokkan dengan jumlah kartu saat hanya toggle ghosting yang aktif. Akhiri dengan **Reset Filter**.

## 10. Hapus, Undo, dan uji dua penghapusan beruntun

1. Di Pipeline, hapus **Nusantara** lewat ikon tempat sampah. **Total Lamaran** turun ke 5 dan **Offer Diterima** ke 1. Klik **Undo** sebelum lima detik. Total kembali 6 dan offer kembali 2. Di detail Nusantara, periksa gaji, checklist **1/2**, dan catatan `Siap demo teknis`. Comparator kembali menampilkan **95,0** dan **81,3**.
2. Untuk menguji dua timer, buat lamaran manual **QA Cadangan**, posisi `Tester`, mode **Remote**, status **WISHLIST**, skill `CSS`. Kolom CV dan tanggal tidak diperlukan. Total sekarang **7**. Pada Pipeline, pilih **Terbaru Diupdate** dan temukan QA Cadangan serta Nusantara sebelum mulai menghitung waktu.
3. Hapus **QA Cadangan** pada detik ke-0. Sekitar detik ke-3, hapus **Nusantara**. Sekitar detik ke-6 dari awal, klik **Undo** di notifikasi Nusantara. Saat itu timer penghapusan pertama sudah melewati lima detik, sementara penghapusan kedua baru sekitar tiga detik.
4. **Lulus jika** notifikasi kedua masih tersedia, hanya Nusantara yang kembali, QA Cadangan tetap terhapus, dan total berakhir di **6**. Untuk menguji kedaluwarsa, hapus **Studio Uji**, tunggu lebih dari lima detik tanpa menekan Undo, lalu tekan F5. Notifikasi sudah hilang dan Studio Uji tetap terhapus. Lakukan bagian ini terakhir.

## Catatan hasil dan urutan presentasi

Beri tanda setelah hasilnya terlihat. Bila satu pemeriksaan gagal, catat langkah, data masukan, hasil aktual, dan pesan Console atau Network yang relevan. Gunakan kolom terakhir untuk membedakan bagian yang lulus dari bagian yang perlu diulang.

| Cek | Bukti yang ditunjukkan | Hasil / catatan |
|---|---|---|
| 1. Fetch dan fallback | Live, error saat offline, retry, 15 data lokal | |
| 2. Profil skill | AwanMerdeka 20% → 40% → 20%, duplikat ditolak, skill tersimpan saat F5 | |
| 3. Eksplorasi | Shortcut /, debounce, filter, urutan, keadaan kosong, Wishlist | |
| 4. Form manual | Fokus ke input salah, anti-duplikat, Applied berhasil tersimpan | |
| 5. State machine dan ghosting | CV wajib, simulasi +15 hari, statistik dan filter ikut berubah | |
| 6. Konflik jadwal | Dua pasangan 30 menit muncul, pasangan 60 menit dikecualikan | |
| 7. Checklist dan log | Progres 1/2 dan catatan bertahan setelah F5 | |
| 8. Timer | Jeda, reset, ganti soal, tutup dan buka, waktu habis | |
| 9. Comparator dan statistik | Status final, dua offer, 95,0 vs 81,3, jumlah dan persentase benar | |
| 10. Undo | Data kembali utuh, timer kedua tetap aktif, Undo kedaluwarsa | |

**Untuk demo singkat**, buka dengan “Saya mulai dari satu lowongan yang cocok dengan skill saya.” Tunjukkan perubahan Docker, simpan Nusantara, lalu bawa lamaran itu melalui Applied, simulasi ghosting, dan Interview. Saat banner tampil, ganti filter agar asisten melihat bahwa pengecekan memakai seluruh data. Akhiri dengan checklist setelah F5, timer yang dibuka ulang, perbandingan dua offer, dan Undo. Gunakan tabel di atas untuk kembali ke pemeriksaan yang ditanyakan asisten.

**Untuk cek teknis sebelum demo**, jalankan `npx tsc --noEmit -p tsconfig.app.json` lalu `npm run build` dari folder proyek. Keduanya harus selesai tanpa error.
