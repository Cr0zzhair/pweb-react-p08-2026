# Panduan & Spesifikasi Praktikum Modul 5: "Aku Mw Magang"

Dokumen ini berisi rangkuman menyeluruh dari soal praktikum Modul 5, rincian spesifikasi setiap fitur/soal, skema data, urutan pengujian (*testcase*), serta **Rules & Pedoman** yang wajib dipatuhi oleh seluruh anggota kelompok.

---

## 1. Ketentuan Umum Praktikum

1. **Tenggat Waktu (Deadline)**: Jumat, **27 November 2026 jam 23:59 WIB**.
2. **Jadwal Demo**: Mulai hari Senin, **30 November 2026 secara OFFLINE** (sesuai plotingan).
3. **Repository GitHub**: Wajib membuat repository **GitHub Public** dengan format penamaan: `pweb-react-p01-2026` (sesuaikan nomor kelompok).
4. **Pengumpulan**: Link repository dikumpulkan melalui Google Form: https://its.id/m/SubmitPemweb2026
5. **Kewajiban Anggota saat Demo**:
   - Pembagian beban tugas harus sama rata.
   - Seluruh anggota wajib hadir saat sesi demo.
   - Setiap anggota wajib menjelaskan alur **kode / state / hooks** yang dikerjakannya dan siap melakukan **tanya-jawab** serta **mini live-coding** langsung di depan asisten.

---

## 2. Gambaran Keseluruhan Aplikasi ("Aku Mw Magang")

Tujuan proyek ini adalah membangun aplikasi **Frontend React + TypeScript** untuk membantu **Kapten** mengelola seluruh proses pencarian dan lamaran magangnya dari awal hingga menerima tawaran (*offer*).

Secara garis besar, aplikasi memiliki **3 bagian utama**:
1. **Eksplorasi Lowongan**: Melihat daftar lowongan kerja dari API Remotive (atau dataset lokal *fallback*), mengelola daftar *skill* Kapten, menghitung persentase kecocokan *skill* (**Match Score %**), dan menyimpan lowongan ke daftar lamaran (*Wishlist*).
2. **War Room Lamaran (Pipeline)**: Melacak status setiap lamaran dengan aturan perpindahan status yang ketat (**State Machine**), *checklist* persiapan per lamaran, latihan *interview* dengan *countdown timer*, deteksi otomatis **Rawan Ghosting** (> 14 hari), dan peringatan **Jadwal Interview Bentrok** (< 60 menit).
3. **Offer Comparator & Dashboard Statistik**: Menampilkan 5 kartu statistik secara *real-time* dan membandingkan dua tawaran magang (*Offer A vs Offer B*) secara objektif berdasarkan bobot gaji, mode kerja, dan kecocokan *skill*.

---

## 3. Rincian Per Soal / Spesifikasi Fitur (Fitur 1 – 7)

### Fitur 1: Profil Skill Kapten & Eksplorasi Lowongan
- **Profil Skill Kapten**:
  - Kapten dapat menambah dan menghapus *skill* miliknya (default awal minimal 3 *skill*, contoh: `React`, `TypeScript`, `CSS`).
  - Menolak input *skill* duplikat (*case-insensitive*).
  - Disimpan secara persisten di `localStorage`.
- **Fetch Data Lowongan**:
  - Mengambil data lowongan memakai `useEffect` + `fetch()` + `AbortController`.
  - Sumber data utama (Live API): `https://remotive.com/api/remote-jobs?category=software-dev&limit=30` (gunakan field `tags` sebagai `requiredSkills`).
  - Sumber data kedua (Fallback Lokal): `public/magang-fallback.json` (berisi 15 lowongan magang tech Indonesia dengan format yang sama). Dapat diakses melalui *toggle* sumber data atau tombol *fallback* saat API utama *error*.
  - Wajib menampilkan 3 kondisi state UI: **Loading**, **Error** (disertai tombol *Coba Lagi / Retry* & *Gunakan Fallback Lokal*), dan **Kosong (Empty State)**.
- **Search Debounce & Filter**:
  - Pencarian kata kunci posisi/perusahaan wajib menggunakan Custom Hook `useDebounce(keyword, 400)`.
  - Mendukung filter berdasarkan kategori dan pengurutan (*sorting*) berdasarkan **Skill Match tertinggi**.
- **Badge & Aksi**:
  - Menampilkan **Match Score %** dengan warna:
    - **Hijau**: `>= 70%`
    - **Kuning**: `40% – 69%`
    - **Merah**: `< 40%`
  - Menampilkan daftar *skill* yang cocok vs *missing skills* (ditandai berbeda).
  - Tombol **"Simpan ke Wishlist"**. Jika pasangan `company + role` sudah ada di daftar lamaran, tombol otomatis *disabled* dan bertuliskan **"Sudah Dilamar"**.

### Fitur 2: Form Tambah Lamaran Manual
- **Controlled Form Penuh**: Seluruh input wajib dikontrol dengan `value` + `onChange`, meliputi:
  - Nama Perusahaan (`company`)
  - Posisi / Role (`role`)
  - Mode Kerja (`Remote` | `Hybrid` | `Onsite`)
  - Status Awal (`WISHLIST` | `APPLIED`)
  - Required Skills (dipisahkan dengan koma, contoh: `React, TypeScript, Git`)
- **Input Kondisional**: Jika Status Awal dipilih `APPLIED`, maka input `cvVersion` (versi file CV) dan `appliedDate` (tanggal melamar) otomatis muncul dan **wajib diisi**.
- **Validasi & Auto-Focus (`useRef`)**:
  - Menolak input kosong dan menolak lamaran duplikat (`company + role` sama, *case-insensitive*).
  - Jika gagal *submit*, kursor otomatis difokuskan ke input pertama yang bermasalah (*error*) menggunakan `useRef`.

### Fitur 3: War Room Pipeline, Ghosting & Bentrok Jadwal
- **Daftar Lamaran**: Menampilkan seluruh lamaran Kapten beserta status, versi CV, *progress checklist* (misal `3/4`), dan `Skill Match %`.
- **Filter & Sorting Gabungan**:
  - Pencarian teks (perusahaan/role)
  - Filter berdasarkan Status
  - Toggle **"Hanya Rawan Ghosting"**
  - Sorting berdasarkan: *Terbaru*, *Jadwal Interview Terdekat*, atau *Offer Tertinggi*.
- **Tombol "Simulasi +15 Hari"**:
  - Tersedia pada lamaran berstatus `APPLIED` atau `SCREENING`.
  - Berfungsi memundurkan `lastUpdatedAt` sebanyak 15 hari ke belakang agar *badge* **Rawan Ghosting** dan angka statistik dapat langsung diuji saat sesi demo.
- **Banner Peringatan Bentrok Jadwal**:
  - Jika terdapat `>= 2` lamaran berstatus `INTERVIEW` dengan selisih jadwal `< 60 menit`, tampilkan *banner* peringatan di bagian atas halaman.
  - **Penting**: Pengecekan bentrok dilakukan dari **seluruh data lamaran**, sehingga *banner* tetap tampil meskipun pengguna sedang mengaktifkan filter tertentu.

### Fitur 4: Detail Lamaran (State Machine, Checklist & Activity Log)
- **Transisi Status Ketat (State Machine)**:
  - Hanya menampilkan opsi status tujuan yang sah sesuai aturan State Machine.
  - Menampilkan input kondisional yang wajib diisi sebelum konfirmasi pindah status:
    - Pindah ke `APPLIED`: wajib isi `cvVersion` & `appliedDate`.
    - Pindah ke `INTERVIEW`: wajib isi `interviewDateTime` (format `YYYY-MM-DDTHH:mm`).
    - Pindah ke `OFFER`: wajib isi `salaryOffer > 0` & `workMode`.
- **Nested Checklist**:
  - Menambah item tugas persiapan baru, mencentang selesai (`done`), dan menghapus item *checklist* di dalam lamaran tersebut.
  - Menampilkan *progress bar* dan indikator `X/Y selesai`.
  - **Wajib Immutable**: Dilarang memutasi array/objek secara langsung (seperti `.push()` atau mengubah properti objek secara langsung).
- **Activity Log**:
  - Mencatat otomatis setiap pembuatan lamaran dan perpindahan status ke dalam `activityLogs[]` lengkap dengan waktu (*timestamp*).
  - Menyediakan input bagi Kapten untuk menambahkan catatan manual ke dalam riwayat aktivitas.

### Fitur 5: Interview Prep Timer
- Di dalam detail lamaran (tab/bagian **Latihan Interview**), sediakan minimal **5 pertanyaan latihan interview magang IT**.
- Sediakan **Countdown Timer `02:00`** per soal dengan tombol:
  - **Start / Pause (Jeda)**
  - **Reset** (kembali ke `02:00`)
  - **Soal Berikutnya / Lanjut** (otomatis me-reset timer ke `02:00`)
- **Wajib Cleanup**: Gunakan `useEffect` dengan `return () => clearInterval(...)` agar *timer* berhenti bersih saat panel/modal ditutup (*unmount*) dan tidak mempercepat hitungan detik (2x lipat) saat dibuka kembali.

### Fitur 6: Undo Delete (5 Detik) & Persistensi Local Storage
- **Toast Undo (5 Detik)**:
  - Saat sebuah lamaran dihapus, tampilkan *Toast Notification* dengan tombol **Undo** selama 5 detik.
  - Jika tombol **Undo** diklik sebelum 5 detik habis, lamaran kembali utuh beserta seluruh *checklist* dan *activity log*-nya.
- **Manajemen Timer dengan `useRef`**:
  - Simpan ID `setTimeout` di dalam `useRef`.
  - Jika Kapten menghapus 2 lamaran berturut-turut dalam waktu `< 5 detik`, *timer* sebelumnya **wajib dibersihkan** menggunakan `clearTimeout` sebelum memulai *timer* baru.
- **Persistensi**:
  - Seluruh state `applications` dan `kaptenSkills` wajib menggunakan Custom Hook `useLocalStorage<T>` agar data tidak hilang saat halaman di-*refresh* (F5).

### Fitur 7: Dashboard Statistik & Offer Comparator
- **5 Kartu Statistik (Derived State)**:
  - Menampilkan: **Total Lamaran**, **Response Rate %**, **Interview Rate %**, **Rawan Ghosting**, dan **Offer Diterima (Total Offer)**.
  - **Wajib dihitung sebagai *derived state*** langsung dari state `applications` (dilarang disimpan ke dalam `useState` terpisah).
- **Offer Comparator**:
  - Jika terdapat minimal 2 lamaran berstatus `OFFER`, Kapten dapat memilih **Offer A** dan **Offer B** melalui *dropdown* untuk melihat perbandingan:
    - Uang Saku / Gaji (`salaryOffer`) & skor normalisasinya
    - Mode Kerja (`workMode`) & skornya
    - Kecocokan Skill (`Skill Match %`) & skornya
    - **Total Skor Berbobot**
    - Badge **"Rekomendasi Terbaik"** pada *offer* dengan skor tertinggi.
  - Jika jumlah lamaran berstatus `OFFER` masih `< 2`, tampilkan pesan *empty state* yang jelas.

---

## 4. Skema Data Utama (`Application`)

Berikut adalah struktur *interface* utama untuk objek lamaran (`Application`):

| Field | Tipe | Keterangan |
| :--- | :--- | :--- |
| `id` | `string` | ID unik lamaran (misal `crypto.randomUUID()`) |
| `company` | `string` | Nama perusahaan yang dilamar |
| `role` | `string` | Posisi / role yang dilamar |
| `workMode` | `"Remote" \| "Hybrid" \| "Onsite"` | Mode kerja (dipakai juga di Offer Comparator) |
| `status` | `ApplicationStatus` | `"WISHLIST" \| "APPLIED" \| "SCREENING" \| "INTERVIEW" \| "OFFER" \| "REJECTED" \| "GHOSTED"` |
| `requiredSkills` | `string[]` | Daftar *skill* yang diminta lowongan (untuk menghitung Skill Match %) |
| `cvVersion` | `string` *(opsional)* | Versi CV yang dikirim (wajib terisi saat pindah ke `APPLIED`) |
| `appliedDate` | `string` *(opsional)* | Tanggal melamar (wajib terisi saat pindah ke `APPLIED`) |
| `interviewDateTime` | `string` *(opsional)* | Format `YYYY-MM-DDTHH:mm` (wajib terisi saat pindah ke `INTERVIEW`) |
| `salaryOffer` | `number` *(opsional)* | Nominal uang saku / gaji dalam Rupiah (wajib `> 0` saat pindah ke `OFFER`) |
| `lastUpdatedAt` | `string` *(ISO)* | Waktu terakhir perubahan status (dasar hitung Rawan Ghosting `> 14 hari`) |
| `checklist` | `ChecklistItem[]` | Array objek `{ id: string, text: string, done: boolean }` |
| `activityLogs` | `ActivityLog[]` | Array objek `{ id: string, timestamp: string, message: string }` |

---

## 5. Rules & Pedoman Kerja Kelompok (Wajib Dipatuhi)

Bagian ini adalah aturan main dan standar kode yang menjadi pedoman pengerjaan kita agar mendapatkan nilai maksimal (**100% + Bonus**).

### A. Aturan Tech Stack & Library (Strict)
1. **React 19 + Vite (`react-ts`) + TypeScript Strict**:
   - Konfigurasi `strict: true` pada `tsconfig.json`.
   - **DILARANG KERAS menggunakan tipe `any`**. Seluruh variabel, parameter, state, props, dan response API wajib memiliki tipe/interface yang eksplisit.
   - Kode wajib lolos pemeriksaan `npx tsc --noEmit` dan `npm run build` tanpa *error*.
2. **Larangan Library Eksternal**:
   - **DILARANG** memakai library state management eksternal (*Redux, Zustand, Recoil, TanStack Query, SWR, dll.*).
   - **DILARANG** memakai library form eksternal (*React Hook Form, Formik, dll.*).
   - Seluruh pengelolaan state, *data fetching*, validasi form, *timer*, dan penyimpanan lokal **wajib ditulis menggunakan React Hooks bawaan & Custom Hooks buatan sendiri**.
3. **Styling & Ikon**:
   - Bebas menggunakan Tailwind CSS atau CSS murni.
   - Diperbolehkan menggunakan library ikon ringan seperti `lucide-react`.

### B. Arsitektur Struktur Folder Modular
Seluruh kode di dalam `src/` wajib dipisahkan sesuai tanggung jawabnya:
```text
├── public/
│   └── magang-fallback.json       # 15 dataset lowongan magang tech Indonesia
├── src/
│   ├── components/                # Komponen UI yang modular & reusable
│   ├── hooks/
│   │   ├── useLocalStorage.ts     # Custom Hook wajib 1: Persistensi localStorage
│   │   └── useDebounce.ts         # Custom Hook wajib 2: Debounce input pencarian
│   ├── services/
│   │   └── jobService.ts          # Service fetch Remotive API & fallback lokal
│   ├── types/
│   │   └── index.ts               # Definisi seluruh TypeScript Interfaces & Types
│   ├── utils/                     # Fungsi murni (Pure Functions):
│   │   ├── stateMachine.ts        # Aturan transisi status yang sah
│   │   ├── skillMatch.ts          # Kalkulasi persentase kecocokan skill
│   │   ├── scheduleConflict.ts    # Deteksi jadwal interview bentrok (< 60 menit)
│   │   └── offerComparator.ts     # Kalkulasi skor berbobot Offer Comparator
│   ├── App.tsx
│   └── main.tsx
```

### C. Aturan Logika Bisnis (Business Rules)

1. **Anti-Duplikat Lamaran**:
   - Pasangan `company` + `role` yang sama tidak boleh dilamar dua kali (*case-insensitive* dan abaikan spasi berlebih dengan `.trim().toLowerCase()`).

2. **Diagram State Machine Transisi Status**:
   - Status hanya boleh berpindah mengikuti alur berikut:
     - `WISHLIST` $\rightarrow$ `APPLIED`
     - `APPLIED` $\rightarrow$ `SCREENING` | `REJECTED` | `GHOSTED`
     - `SCREENING` $\rightarrow$ `INTERVIEW` | `REJECTED` | `GHOSTED`
     - `INTERVIEW` $\rightarrow$ `OFFER` | `REJECTED` | `GHOSTED`
     - `GHOSTED` $\rightarrow$ `SCREENING` *(Khusus status `GHOSTED` diperbolehkan kembali ke `SCREENING`)*
     - `OFFER` dan `REJECTED` bersifat **FINAL** (tidak bisa berpindah ke status lain).

3. **Rumus Skill Match Score (%)**:
   - Dihitung secara *derived state* dan *case-insensitive*:
     $$\text{Skill Match (\%)} = \text{Math.round}\left(\frac{\text{jumlahCocok}}{\text{totalRequired}} \times 100\right)$$
   - *Catatan*: Jika `totalRequired === 0`, maka nilai kecocokan adalah `100%`.

4. **Deteksi Rawan Ghosting**:
   - Lamaran dengan status `APPLIED` atau `SCREENING` yang memiliki selisih waktu `Sekarang - lastUpdatedAt > 14 hari` (`> 14 * 24 * 60 * 60 * 1000` ms) otomatis ditandai dengan *badge* **Rawan Ghosting** (dihitung sebagai *derived state*).

5. **Deteksi Bentrok Jadwal Interview**:
   - Cek seluruh lamaran yang berstatus `INTERVIEW` dan memiliki `interviewDateTime`.
   - Jika terdapat minimal 2 lamaran dengan selisih waktu absolut `|Waktu A - Waktu B| < 60 menit` (`< 3.600.000` ms), munculkan *banner* peringatan bentrok beserta nama perusahaan dan jamnya.

6. **Rumus Skor Offer Comparator**:
   - **Normalisasi Gaji (0 – 100)**:
     $$\text{Normalisasi Gaji} = \left(\frac{\text{Gaji Offer}}{\max(\text{Gaji Offer A}, \text{Gaji Offer B})}\right) \times 100$$
     *(Sehingga bobot 50% dari gaji tertinggi menghasilkan `50.0 / 50`, contoh: Gaji Rp 6.000.000 vs Rp 4.500.000 $\rightarrow$ Offer A mendapat `50.0 / 50` dan Offer B mendapat `37.5 / 50`)*.
   - **Skor Mode Kerja**:
     - `Remote` = **100** (dikali 25% = `25.0 / 25`)
     - `Hybrid` = **75** (dikali 25% = `18.8 / 25`)
     - `Onsite` = **50** (dikali 25% = `12.5 / 25`)
   - **Skor Skill Match**:
     - Persentase `Skill Match %` (0 – 100) dikali bobot **25%**.
   - **Total Skor Berbobot**:
     $$\text{Total} = (\text{Normalisasi Gaji} \times 50\%) + (\text{Skor Mode Kerja} \times 25\%) + (\text{Skill Match \%} \times 25\%)$$

### D. Aturan React Hooks & State Management (Bobot 30%)
1. **Immutability Bertingkat**:
   - Saat meng-update *nested state* seperti `checklist` atau `activityLogs` di dalam sebuah `Application`, selalu gunakan `.map()` dan *spread operator* (`{ ...app, checklist: app.checklist.map(...) }`). Jangan pernah melakukan mutasi langsung!
2. **Derived State**:
   - Jangan pernah membuat `useState` untuk: Statistik Dashboard, Status Rawan Ghosting, Daftar Bentrok Interview, Skill Match Score, maupun daftar lamaran hasil *filter/sort*. Hitung semuanya secara langsung (*on-the-fly* atau dengan `useMemo`) dari state utama `applications` dan `kaptenSkills`.
3. **Disiplin `useEffect` Cleanup & `useRef`**:
   - Pastikan `AbortController` digunakan saat *fetch* API di `useEffect`.
   - Pastikan `clearInterval` dipanggil pada *cleanup* `useEffect` di **Interview Prep Timer**.
   - Pastikan `useRef` digunakan untuk menyimpan *timer ID* pada **Undo Delete 5 detik** dan untuk **Auto-Focus** input yang *error* pada **Form Tambah Lamaran Manual**.

---

## 6. Daftar Urutan Testcase (Wajib Lulus Sebelum Demo)

| No | Skenario | Hasil yang Diharapkan |
| :-: | :--- | :--- |
| **1** | **Fetch & Offline Error** | Muncul *Loading* lalu daftar lowongan tampil. Saat *DevTools -> Offline* dan klik *Retry*, muncul pesan *error* + tombol *fallback* lokal. |
| **2** | **Skill Match Live** | Tambah *skill* `"Docker"` di Profil Kapten $\rightarrow$ persentase *Match* lowongan yang meminta *Docker* langsung naik otomatis. |
| **3** | **Debounce Search** | Ketik cepat di kolom pencarian $\rightarrow$ filter baru berjalan setelah jeda `~400ms`. |
| **4** | **Anti-Duplikat & Focus** | Simpan 1 lowongan $\rightarrow$ tombol jadi `"Sudah Dilamar"`. Input `company + role` sama di Form Manual $\rightarrow$ ditolak dan fokus otomatis via `useRef`. |
| **5** | **State Machine** | Pindah `WISHLIST` $\rightarrow$ `APPLIED` (isi CV & tanggal) $\rightarrow$ `SCREENING` $\rightarrow$ `INTERVIEW` (isi jadwal). `WISHLIST` tidak bisa langsung ke `OFFER`. |
| **6** | **Simulasi Ghosting** | Klik `"Simulasi +15 Hari"` pada status `APPLIED` $\rightarrow$ *badge* Rawan Ghosting muncul dan angka statistik bertambah. |
| **7** | **Bentrok Interview** | Buat 2 lamaran `INTERVIEW` selisih 30 menit $\rightarrow$ *Banner Bentrok* tampil, dan tetap tampil meski filter status lain dipilih. |
| **8** | **Checklist & Refresh** | Tambah 2 *checklist*, centang 1 (*progress* `1/2`), lalu *Refresh* (F5) $\rightarrow$ semua data tetap utuh. |
| **9** | **Timer Cleanup** | *Start Prep Timer* $\rightarrow$ tutup modal sebelum habis $\rightarrow$ buka lagi $\rightarrow$ tidak ada *error console* dan detik tetap normal (tidak 2x cepat). |
| **10** | **Undo & Comparator** | Hapus 1 lamaran lalu klik *Undo* `< 5 detik` $\rightarrow$ data kembali utuh. Pindahkan 2 lamaran ke `OFFER` $\rightarrow$ cek skor berbobot di *Offer Comparator*. |

---

## 7. Rubrik Penilaian & Target Fitur Bonus

### Rubrik Penilaian Utama (100%)
- **Fungsionalitas & Aturan Main (30%)**: Kelengkapan 7 fitur, State Machine, anti-duplikat, bentrok jadwal, ghosting, dan Offer Comparator.
- **Logika React & Hooks (30%)**: Immutability bertingkat, *derived state*, `useEffect` cleanup, `useRef`, serta Custom Hooks (`useLocalStorage` & `useDebounce`).
- **TypeScript & Arsitektur (15%)**: Lolos `tsc --noEmit`, tanpa tipe `any`, dan struktur folder modular.
- **Demo & Mini Live Coding (15%)**: Pemahaman tiap anggota atas logika state/hooks dan kemampuan melakukan modifikasi kecil saat demo.
- **UI/UX & State Handling (10%)**: Tampilan rapi, responsif, serta penanganan *Loading*, *Error*, dan *Empty state*.

### Target Nilai Tambahan / Bonus
Untuk mendapatkan nilai bonus, kita juga akan mengimplementasikan fitur tambahan berikut tanpa melanggar aturan *library*:
1. **Export / Import Backup JSON**: Mengunduh data `applications` & `kaptenSkills` sebagai file `.json` dan mengunggahnya kembali.
2. **Dark Mode**: Toggle tema gelap/terang yang disimpan memakai `useLocalStorage`.
3. **Keyboard Shortcut (`/`)**: Menekan tombol `/` di *keyboard* otomatis memfokuskan kursor ke *search bar* menggunakan `useRef`.

---

## 8. Pedoman Desain UI/UX (Referensi: `cif.ucs.or.id` Design System)

Seluruh antarmuka **"Aku Mw Magang"** akan mengadopsi filosofi desain dan *Design System v1.0* dari **Capture ITS Flag 2026 (`cif.ucs.or.id`)**: *"Graphic by nature. Precise by design. Electric blue, crystalline geometry, and a clear hierarchy between expressive graphics and functional interfaces."*

### A. Palet Warna & Semantic Tokens (`:root`)
- **Brand Colors**:
  - `brand-blue-950`: `#003471` (Deep Navy untuk *panel*, *input*, *modal*, *hard shadow*, & *sidebar*)
  - `brand-blue-800`: `#0A4FB9` (Electric Royal Blue untuk *base surface page*)
  - `brand-blue-700`: `#0169E5` (Outline / highlight biru terang)
  - `brand-blue-600`: `#0059FF` | `brand-blue-500`: `#0073FF` | `brand-blue-400`: `#00AEFF`
  - `brand-cyan-500`: `#01C7E5` | `brand-cyan-400`: `#00F6FF` (Aksen utama, *focus ring*, *timeline dot*, *active tab*)
  - `brand-cyan-300`: `#0DFFEB` | `brand-cyan-200`: `#9AFFF6` (Teks *eyebrow* & aksen sekunder)
  - `brand-violet-600`: `#5502C8` | `brand-violet-500`: `#7902C8`
  - `required / danger`: `#FFC1C1` (Indikator wajib, *error validation*, & *missing skills*)
- **Surface & Background**:
  - `--surface-page`: `#0A4FB9` dengan latar `.page-field` (`radial-gradient(at 52% 44%, #1B6AE4, #0A4FB9 82%)`)
  - **Construction Grid Motif** (`.construction-grid`): Latar grid tipis `188px x 188px` (`linear-gradient(#ffffff1a 1px, transparent 1px), linear-gradient(90deg, #ffffff1a 1px, transparent 1px)`)
  - `--surface-panel`: `#00347152` (Panel *semi-translucent* di atas latar biru)
  - `--surface-panel-hover`: `#00347175`
- **Text & Borders**:
  - `--text-primary`: `#FFFFFF`
  - `--text-secondary`: `#FFFFFFC7` (78% white)
  - `--text-muted`: `#FFFFFF94` (58% white)
  - `--border-subtle`: `#FFFFFF2E` | `--border-medium`: `#FFFFFF52` | `--border-strong`: `#FFFFFF8F`

### B. Tipografi
- **Font Family**: `"Plus Jakarta Sans", system-ui, sans-serif` (Variable `200–800`, Upright & Italic).
- **Display Heading (`.brand-display`)**:
  - `font-weight: 800`, `font-style: italic`, `text-transform: uppercase`, `letter-spacing: -0.02em`, `line-height: 0.98`.
  - Dilengkapi *hard multi-directional text-shadow*: `0 3px #003471, 3px 3px #003471, -3px 3px #003471, 3px 0 #0169E5, -3px 0 #0169E5`.
- **Eyebrow Label (`.eyebrow`)**:
  - `font-size: 12px`, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.16em`, warna `brand-cyan-400` (`#00F6FF`) atau `brand-cyan-200` (`#9AFFF6`).

### C. Karakteristik Komponen UI
1. **Header Bar (Floating White Card)**:
   - Di bagian atas halaman, menggunakan kartu putih bersih (`bg-white text-brand-blue-950 rounded-md border border-brand-blue-800/20 shadow-panel`) dengan navigasi tab dan tombol aksi yang kontras.
2. **Buttons (`.button`)**:
   - Tinggi minimal `48px`, `border-radius: 8px`, `font-weight: 700`, `padding: 12px 24px`, efek *hover* `transform: translateY(-2px)` dengan *easing* `cubic-bezier(.2, .8, .2, 1)`.
   - **Primary (`.button-primary`)**: Latar `#FFFFFF`, teks `#0A4FB9`, dengan *hard bottom shadow* `box-shadow: 0 4px #003471`.
   - **Accent (`.button-accent`)**: Latar `linear-gradient(135deg, #00F6FF, #0073FF)`, teks `#003471`, `box-shadow: 0 4px #003471`.
   - **Secondary (`.button-secondary`)**: Border `--border-strong`, latar `#0034712E`, teks `#FFFFFF`.
3. **Cards & Panels (`.panel`)**:
   - Latar `--surface-panel` (`#00347152`) atau solid `#003471` untuk modal/elemen fokus, border `1px solid var(--border-subtle)`, *flat & quiet* dengan hierarki tipografi yang tegas.
4. **Form Controls (`.field`)**:
   - Latar solid `#003471`, border `1px solid var(--border-strong)`, teks `#FFFFFF`, `border-radius: 8px`, tinggi minimal `48px`.
   - Saat *error* (`aria-invalid="true"`): border `2px solid #FFC1C1` dengan pesan `! Error` berwarna `#FFC1C1`.
   - Saat *focus-visible*: `outline: 2px solid #00F6FF; outline-offset: 5px`.
5. **Timeline & Activity Log**:
   - Garis vertikal kiri `border-l border-border-strong` dengan *square marker* (`h-2 w-2 bg-brand-cyan-400`) pada setiap item riwayat aktivitas.
6. **Modal & Toast Undo**:
   - **Modal**: Latar `#003471`, border `1px solid var(--border-strong)`, `border-radius: 12px`, `box-shadow: 0 12px 30px #00347138`, backdrop `#001941BF`.
   - **Toast**: Posisi *fixed* kanan bawah (`bottom: 24px; right: 24px`), latar `#003471`, border `1px solid #00F6FF`, `box-shadow: var(--shadow-panel)`.

