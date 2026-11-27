---
version: alpha
name: Pixel Arcade
description: Sistem desain UI aplikasi dengan bentuk 8-bit, panel ungu gelap, dan aksi utama cyan.
colors:
  canvas: "#121022"
  surface: "#211B36"
  surface-raised: "#30264A"
  on-surface: "#F8F5FF"
  on-surface-muted: "#C2B9D4"
  border: "#8878AB"
  shadow: "#090713"
  primary: "#42F5D1"
  on-primary: "#121022"
  primary-hover: "#7FFFE6"
  primary-pressed: "#29DDB9"
  focus: "#42F5D1"
  highlight: "#FF78C8"
  milestone: "#FFD166"
  error: "#FF8C9B"
typography:
  headline-mobile:
    fontFamily: Press Start 2P
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  headline-desktop:
    fontFamily: Press Start 2P
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.5
  title:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
  metadata:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
rounded:
  none: 0px
motion:
  state-change:
    duration: 90ms
    timingFunction: ease-out
  surface-enter:
    duration: 150ms
    timingFunction: ease-out
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: 44px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-pressed:
    backgroundColor: "{colors.primary-pressed}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    height: 44px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    padding: 16px
---

# Pixel Arcade

## Overview

Tema ini membawa bentuk kotak, aksen terang, dan respons tombol seperti panel mesin arcade 8-bit ke aplikasi modern. Dalam satu layar, pengguna perlu bisa mengenali posisi mereka, menemukan aksi utama, dan memahami hasil tindakannya. Bentuk pixel muncul lewat siluet, jarak, dan bayangan blok. Navigasi, formulir, dan teks tetap mengikuti pola aplikasi yang familier.

Gunakan sistem ini pada layar dan komponen yang memang diperlukan aplikasi. Dashboard di bawah adalah contoh penerapan. Progress, skor, dan pencapaian mengikuti data nyata dari fitur terkait.

## Referensi dan penerapannya

| Referensi | Pengamatan | Penerapan di Pixel Arcade |
| --- | --- | --- |
| [Pac-Man — MoMA](https://www.moma.org/collection/works/164917?locale=en) dan [arsip pameran MoMA](https://press.moma.org/wp-content/uploads/2021/06/2-MoMA_Never-Alone_Checklist_FINAL.pdf) | Skor berada di area tersendiri di atas arena. Garis terang membingkai arena gelap, sementara indikator lain berada di bawah. | Tempatkan ringkasan penting di dekat atas layar dan pisahkan dari area kerja. Pakai satu aksen dominan agar tombol utama mudah ditemukan. |
| [Space Invaders — arsip Taito](https://taito.co.jp/70th/history) | Versi awal berangkat dari tampilan hitam-putih. Siluet dan pengulangan bentuk membantu memberi struktur pada layar. | Ulangi bentuk kotak dan jarak secara konsisten pada progress bar dan ikon. Pastikan struktur tetap terbaca saat warna dihilangkan. |
| [Vercel Arcade — design.md](https://github.com/vercel-labs/arcade/blob/main/design.md) | Font pixel dipakai untuk merek dan judul pendek. Teks navigasi dan kontrol memakai font yang lebih mudah dibaca. | Gunakan Press Start 2P untuk judul pendek dan Inter untuk teks, formulir, serta navigasi. |
| [Kenney Pixel UI Pack](https://kenney.nl/assets/pixel-ui-pack) dan [MDN — Crisp pixel art](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look) | Kenney menyediakan aset pixel seperti panel dan tombol berlisensi CC0. MDN mendokumentasikan cara memperbesar aset raster agar tepinya tetap tajam. | Pakai ikon orisinal atau aset yang sesuai lisensinya. Perbesar sprite pada kelipatan bulat dan aktifkan rendering pixel hanya pada aset raster yang membutuhkannya. |

Palet ungu-cyan, skala tipografi, dan aturan komponen di bawah adalah keputusan visual untuk tema ini. Gunakan pola umum dari referensi dan buat identitas aplikasi sendiri melalui ikon, ilustrasi, dan penamaan.

## Colors

| Token | Peran |
| --- | --- |
| `canvas` | Latar seluruh halaman dan warna teks di atas cyan atau emas. |
| `surface` | Kartu, navigasi, dialog, dan panel. |
| `surface-raised` | Baris terpilih atau panel sekunder yang perlu terlihat di atas kartu. Tambahkan penanda bentuk atau teks untuk status terpilih. |
| `on-surface` | Judul, label penting, dan teks utama. |
| `on-surface-muted` | Deskripsi sekunder, metadata, dan catatan. |
| `border` | Garis kontrol, pemisah, dan batas progress bar. |
| `primary` | Tombol utama, progress aktif, dan penanda pilihan. |
| `focus` | Indikator fokus keyboard. Pisahkan dari tombol dengan jarak 3 px agar siluet fokus terlihat. |
| `highlight` | Aksen pink untuk ilustrasi atau kategori yang punya label. |
| `milestone` | Pencapaian atau penanda selesai jika fitur memilikinya. Pasangkan dengan teks atau ikon centang. |
| `error` | Garis, ikon, dan teks error pada panel gelap. |
| `shadow` | Bayangan blok tanpa blur. |

Pilih satu tombol cyan dominan per area kerja. Aksi pendamping memakai panel gelap dan outline. Pertahankan warna status ketika elemen masuk keadaan hover, fokus, atau ditekan.

### Rasio kontras

Rasio di bawah dihitung untuk warna solid dari token. Ukur ulang jika latar, opacity, atau tekstur diubah. Untuk teks biasa gunakan sedikitnya 4,5:1. Untuk batas kontrol dan indikator visual yang diperlukan untuk mengenali kontrol atau status, gunakan sedikitnya 3:1 terhadap warna yang bersebelahan. [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)

| Pasangan | Rasio |
| --- | --- |
| Teks utama pada panel | 15,29:1 |
| Teks sekunder pada panel | 8,77:1 |
| Teks gelap pada tombol cyan | 13,55:1 |
| Teks gelap pada tombol hover | 15,45:1 |
| Teks gelap pada tombol ditekan | 10,81:1 |
| Teks error pada panel | 7,43:1 |
| Border pada panel terangkat | 3,54:1 |
| Fokus cyan terhadap panel terangkat | 10,13:1 |

## Typography

- Gunakan **Press Start 2P** pada merek dan satu judul layar pendek. Pakai 18 px di layar sempit dan 24 px mulai 1024 px. Untuk judul dinamis yang bisa panjang, gunakan Inter 20 px tebal dan izinkan teks membungkus.
- Gunakan **Inter** untuk kartu, tombol, field, navigasi, dan isi. Ukuran normal 16 px dengan line height sekitar 1,55. Simpan 14 px untuk metadata dan keterangan.
- Gunakan `font-variant-numeric: tabular-nums` pada counter yang nilainya sering berubah. Tampilkan satuan jika angka membutuhkannya, misalnya “3 dari 5 tugas”.
- Pilih fallback `monospace` untuk judul pixel dan `system-ui, sans-serif` untuk Inter. Gunakan teks HTML agar isi bisa dibaca alat bantu, dipilih, dan diperbesar. [Google Fonts — Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)

## Layout

| Lebar viewport | Susunan | Padding halaman / jarak antarkomponen |
| --- | --- | --- |
| Di bawah 640 px | Satu kolom. Judul dan aksi utama boleh tersusun vertikal. | 16 / 16 px |
| 640–1023 px | Dua kolom untuk kumpulan kartu yang sejenis. Formulir dan daftar detail dapat memakai satu kolom. | 24 / 16 px |
| Mulai 1024 px | Area utama maksimum 1200 px. Gunakan hingga tiga kolom untuk kartu sejenis jika isi tiap kartu cukup pendek. | 32 / 24 px |

- Gunakan 4–8 px untuk hubungan dekat seperti ikon dan label, 12–16 px di dalam kontrol atau panel, dan 24–32 px antarbagian.
- Urutan halaman mengikuti alur membaca. Letakkan navigasi, judul, ringkasan jika ada, lalu konten dan aksi terkait. Urutan fokus keyboard mengikuti urutan tersebut.
- Pada lebar 320 px, izinkan judul dan label membungkus. Tata ulang aksi yang bersebelahan menjadi susunan vertikal ketika ruang menyempit. Jaga agar fungsi inti tetap terlihat tanpa scroll horizontal atau tooltip hover.

## Elevation & Depth

- Gunakan radius 0 px untuk tombol, panel, input, dialog, dan progress bar. Pakai border 2 px untuk batas kontrol dan panel utama. Gunakan garis 1 px untuk pemisah antarbaris yang hanya membantu pemindaian.
- Gunakan bayangan `4px 4px 0` dengan token `shadow` pada tombol utama. Dialog memakai `6px 6px 0`. Panel biasa cukup memakai border dan warna permukaan.
- Untuk ikon pixel, mulai dari grid 16 × 16 dan render pada 16, 32, atau 48 px sesuai konteks. Sediakan area klik di sekeliling ikon. Terapkan `image-rendering: pixelated` pada sprite raster saat diperbesar.
- Jika ilustrasi memakai efek garis layar CRT, tempatkan efek statis di dalam ilustrasi. Pertahankan bidang solid di belakang teks dan kontrol. [MDN — Crisp pixel art](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look)

## Components

### Tombol dan tautan

| Keadaan | Tampilan dan perilaku |
| --- | --- |
| Normal | Tombol utama menggunakan cyan dengan teks gelap, border 2 px, bayangan 4 px, dan label kata kerja. Tombol sekunder memakai panel gelap, border `border`, dan teks terang. |
| Hover | Gunakan `primary-hover` pada tombol utama dan `surface-raised` pada tombol sekunder untuk perangkat yang mendukung hover. |
| Ditekan | Gunakan `primary-pressed`. Geser wajah tombol 2 px ke kanan-bawah dan kurangi bayangan menjadi 2 px. Area klik tetap di posisi semula. |
| Fokus keyboard | Pakai `outline` cyan 2 px dengan offset 3 px. Sisakan ruang agar outline tidak terpotong di tepi panel atau grid. |
| Memproses | Pertahankan ukuran tombol, tampilkan label seperti “Menyimpan…”, dan cegah submit ganda selama operasi berlangsung. Beri umpan balik saat operasi selesai atau gagal. |
| Nonaktif | Gunakan permukaan gelap, warna teks sekunder, dan hilangkan bayangan. Tampilkan alasan di dekat kontrol jika diperlukan untuk melanjutkan. |

Gunakan tinggi minimum 44 px untuk tombol dan area target minimum 44 × 44 px untuk kontrol ikon. Biarkan tinggi tumbuh ketika label membungkus. Gunakan elemen tombol untuk menjalankan aksi dan tautan untuk berpindah halaman. Beri nama aksesibel untuk kontrol yang hanya menampilkan ikon.

### Navigasi dan kartu

- Navigasi aktif memakai label lebih tebal, latar terangkat, dan garis cyan 2 px. Pada navigasi web, gunakan `aria-current="page"` untuk halaman aktif.
- Kartu konten memakai `surface`, border 2 px, dan padding 16 px. Susun judul, isi singkat, status jika relevan, lalu aksi. Tampilkan penanda klik hanya ketika kartu punya tujuan.
- Jika kartu punya beberapa aksi, gunakan link pada judul dan tombol terpisah untuk tindakan lain. Setiap aksi punya fokus keyboard sendiri.

### Indikator progres dan status

- Untuk langkah diskret yang sedikit, gunakan segmen kotak. Contohnya, progres 3 dari 5 menampilkan tiga segmen cyan dan dua segmen kosong berbingkai. Letakkan “3 dari 5 langkah” di dekat indikator.
- Untuk nilai kontinu atau ketika segmen terlalu kecil, gunakan satu batang berbingkai dan teks “60%”. Pada web, gunakan `<progress>` dengan label untuk progres tugas yang terukur. Jika segmen bersifat visual saja, sembunyikan segmen dari pembaca layar dan pertahankan satu representasi aksesibel.
- Gunakan kata seperti “Selesai”, “Menunggu”, atau “Gagal” bersama ikon atau warna. Umumkan hasil penting melalui status yang bisa dibaca alat bantu tanpa memindahkan fokus secara mendadak.

### Formulir dan dialog

- Letakkan label di atas field dan pertahankan label saat pengguna mengetik. Field memakai latar `canvas`, border 2 px, dan tinggi minimum 44 px. Hubungkan petunjuk dan pesan error dengan field yang dimaksud. Simpan input pengguna jika proses penyimpanan gagal.
- Gunakan judul yang menyebut tindakan. Tampilkan pesan di dekat sumber masalah. Contoh “Judul wajib diisi” atau “Perubahan belum tersimpan. Coba lagi.”
- Saat dialog dibuka, pindahkan fokus masuk ke dialog. Jaga navigasi Tab tetap di dalamnya, dukung Escape untuk menutup, dan kembalikan fokus ke pemicu atau titik logis berikutnya. Untuk konfirmasi tindakan yang sulit dibalik, fokus awal bisa diletakkan pada aksi aman. [W3C — Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

## Motion & Micro-interaction

Gunakan 90 ms untuk perubahan warna atau kedalaman tombol dan sekitar 150 ms untuk kemunculan panel jika animasi membantu menjelaskan perubahan. Gerakan tombol terbatas pada wajah tombol sehingga layout dan target sentuh stabil. Gunakan indikator fokus yang langsung terlihat. Hindari layar berkedip, guncangan, dan efek CRT bergerak.

Saat `prefers-reduced-motion: reduce` aktif, gunakan perubahan warna, outline atau teks sebagai umpan balik. Hilangkan translasi tombol dan animasi panel yang tidak diperlukan. Status loading tetap dapat dikenali dari teks. [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

## Voice & Content Strategy

Gunakan bahasa Indonesia yang ringkas dan sesuai aksi. Judul pendek boleh terasa seperti judul layar arcade. Untuk tombol, pakai label seperti “Simpan perubahan”, “Buka detail”, atau “Coba lagi”. Saat daftar kosong, sebutkan apa yang akan muncul dan tampilkan aksi bila pengguna bisa menambah data. Misalnya “Belum ada tugas” dengan tombol “Tambahkan tugas”.

## Contoh penerapan

Untuk dashboard tugas, gunakan judul pixel “Aktivitas”, ringkasan “3 dari 5 tugas selesai”, dan satu tombol cyan “Tambahkan tugas”. Di bawahnya, tampilkan daftar dengan judul tugas dalam Inter, status berbentuk teks, dan tautan “Buka detail”. Di layar sempit, letakkan ringkasan dan tombol dalam satu kolom. Di desktop, sejajarkan tombol dengan blok judul bila tersedia ruang.

Jika aplikasi tidak punya fitur progres, jadikan fungsi utama sebagai pusat layar. Tema tetap terlihat melalui tipografi judul, border kotak, kedalaman tombol, dan palet.

## Pemeriksaan implementasi

- [ ] Layar berfungsi pada 320, 640, 1024, dan 1440 px. Cek juga zoom teks dan judul bahasa Indonesia yang panjang.
- [ ] Teks, kontrol, dan indikator menggunakan pasangan warna yang lolos target kontras pada permukaan aktual.
- [ ] Aksi utama terbaca dari label dan hierarki visual. Status tetap jelas dalam tampilan grayscale.
- [ ] Navigasi, formulir, dan dialog berfungsi dengan keyboard. Fokus terlihat dan tidak tertutup elemen mengambang.
- [ ] Periksa keadaan normal, hover, tekan, fokus, nonaktif, loading, kosong, error, dan sukses yang relevan.
- [ ] Sprite raster tajam pada ukuran yang digunakan. Mode pengurangan gerak tetap menampilkan umpan balik.
- [ ] Aset memakai karya orisinal atau sumber berlisensi sesuai penggunaan.

## Instruksi untuk coding agent

Baca file ini sebelum mengubah UI. Petakan token ke sistem styling proyek dan gunakan komponen yang sudah ada. Mulai dari satu layar yang mewakili penggunaan inti. Terapkan warna, hierarki judul, tombol, dan kartu, lalu cek keadaan interaksi dan tata letak di HP. Gunakan data dan fungsi yang tersedia di aplikasi.

Struktur front matter dan bagian utama mengacu pada [spesifikasi Google Labs DESIGN.md](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md). Tabel dan aturan tambahan menjelaskan cara menerapkan token pada tema Pixel Arcade.

