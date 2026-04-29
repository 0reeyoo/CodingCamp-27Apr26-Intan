# 💰 Pelacak Pengeluaran Harian

Aplikasi web mobile-friendly untuk melacak pengeluaran harian Anda dengan fitur lengkap dan antarmuka yang intuitif.

## ✨ Fitur Utama

### 📊 Dashboard
- **Total Pengeluaran**: Menampilkan total keseluruhan, pengeluaran bulan ini, dan pengeluaran hari ini
- **Grafik Pie Chart**: Visualisasi distribusi pengeluaran berdasarkan kategori
- **Daftar Transaksi**: Menampilkan semua transaksi dengan opsi filter dan sorting
- **Budget Warning**: Peringatan otomatis jika pengeluaran melampaui batas harian (1/30 dari budget bulanan)

### ➕ Tambah Transaksi
- Form lengkap untuk menambahkan transaksi baru
- Pilihan kategori default dan kategori custom
- Opsi untuk menambah kategori baru secara langsung
- Catatan tambahan untuk setiap transaksi

### 📅 Ringkasan Bulanan
- Tampilkan pengeluaran per kategori untuk bulan yang dipilih
- Menampilkan jumlah transaksi per kategori
- Total pengeluaran bulan tersebut

### ⚙️ Pengaturan
- **Batas Pengeluaran**: Atur batas pengeluaran bulanan
- **Manajemen Kategori**: Lihat dan hapus kategori custom
- **Export Data**: Unduh semua data dalam format JSON
- **Import Data**: Impor data dari file JSON yang diekspor sebelumnya
- **Hapus Data**: Hapus semua data (dengan konfirmasi)

### 🌙 Mode Gelap/Terang
- Toggle antara mode terang dan mode gelap
- Preferensi disimpan di Local Storage

## 🛠️ Teknologi

- **HTML5**: Struktur halaman
- **CSS3**: Styling responsive dan modern
- **Vanilla JavaScript**: Logika aplikasi tanpa framework
- **Local Storage**: Penyimpanan data di sisi klien
- **Canvas API**: Rendering pie chart

## 📱 Kompatibilitas

- ✅ Chrome (versi terbaru)
- ✅ Firefox (versi terbaru)
- ✅ Safari (versi terbaru)
- ✅ Edge (versi terbaru)
- ✅ Mobile browsers

## 🚀 Cara Menggunakan

1. Buka `index.html` di browser Anda
2. Aplikasi akan memuat dengan kategori default: Makanan, Transportasi, Hiburan, Kesehatan, Belanja
3. Klik tab "Tambah" untuk menambahkan transaksi baru
4. Gunakan tab "Dashboard" untuk melihat overview dan daftar transaksi
5. Tab "Ringkasan" menampilkan ringkasan per bulan
6. Tab "Pengaturan" untuk konfigurasi dan manajemen data

## 🎯 Fitur Sorting & Filtering

### Sorting Options:
- Terbaru (default)
- Terlama
- Jumlah Tertinggi
- Jumlah Terendah
- Berdasarkan Kategori

### Filtering:
- Filter transaksi berdasarkan kategori
- Kombinasikan dengan sorting untuk hasil yang lebih spesifik

## 💡 Fitur Highlight

- **Budget Alert**: Transaksi individual yang melebihi rata-rata harian (budget/30) akan ditandai dengan warna kuning
- **Kategori Custom**: Tambahkan kategori sesuai kebutuhan Anda
- **Data Persistence**: Semua data disimpan secara otomatis di Local Storage
- **Responsive Design**: Tampilan optimal di desktop, tablet, dan mobile
- **Export/Import**: Backup dan restore data dengan mudah

## 📂 Struktur File

```
bootcamp/
├── index.html          # File HTML utama
├── css/
│   └── style.css      # 1 file CSS dengan semua styling
├── js/
│   └── app.js         # 1 file JavaScript dengan semua logika
└── README.md          # File dokumentasi ini
```

## 🔒 Keamanan Data

- Semua data disimpan di Local Storage (tidak dikirim ke server)
- Data hanya tersimpan di browser Anda
- Export data untuk backup manual
- Tidak ada tracking atau pengumpulan data

## ⌨️ Shortcut & Tips

- Tanggal transaksi default adalah hari ini
- Tekan Tab untuk navigasi form yang lebih cepat
- Gunakan fitur Export untuk backup data secara berkala
- Atur batas pengeluaran untuk monitoring pengeluaran

## 🎨 Customization

Anda dapat mengubah:
- Warna tema di CSS (variabel `:root`)
- Kategori default di JavaScript (constant `DEFAULT_CATEGORIES`)
- Format currency (saat ini dalam Rupiah/IDR)

## 📝 Format Data JSON Export

```json
{
  "transactions": [
    {
      "id": 1234567890,
      "name": "Makan siang",
      "amount": 50000,
      "category": "Makanan",
      "date": "2024-04-29",
      "note": "Nasi goreng",
      "createdAt": "2024-04-29T18:35:00.000Z"
    }
  ],
  "categories": ["Makanan", "Transportasi", "Hiburan", "Kesehatan", "Belanja", "Custom"],
  "budgetLimit": 1000000,
  "exportDate": "2024-04-29T18:35:00.000Z"
}
```

## 🤝 Kontribusi

Untuk perbaikan atau fitur tambahan, silakan modifikasi file HTML, CSS, dan JavaScript sesuai kebutuhan Anda.

## 📄 Lisensi

Aplikasi ini bebas digunakan untuk keperluan pribadi dan komersial.

---

**Dibuat dengan ❤️ untuk membantu Anda mengelola pengeluaran**
