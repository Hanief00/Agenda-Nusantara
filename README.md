# Agenda Nusantara (Todo List)

Aplikasi mobile Todo List berbasis React Native + Expo yang menyimpan data secara lokal menggunakan SQLite. Fokus utama aplikasi ini adalah manajemen tugas harian tanpa server dan tanpa koneksi internet.

## Fitur Utama

- Login lokal dengan akun default (user/user)
- Tambah tugas Biasa atau Penting
- Date picker native (tanpa input tanggal manual)
- Daftar tugas dengan status selesai/belum
- Warna indikator panah: merah (Penting) dan hijau (Biasa)
- Statistik tugas selesai/belum di Beranda
- Grafik horizontal tugas selesai per hari (bonus)
- Ganti password akun default di Pengaturan

## Teknologi

- Expo (React Native)
- SQLite lokal via expo-sqlite
- React Navigation (native stack)
- react-native-chart-kit
- @react-native-community/datetimepicker

## Struktur Folder Utama

- App.js: entry utama + konfigurasi navigasi
- src/database/db.js: inisialisasi SQLite dan helper DB
- src/screens:
  - LoginScreen.js
  - HomeScreen.js
  - AddTaskScreen.js
  - TaskListScreen.js
  - SettingsScreen.js

## Cara Menjalankan

1. Install dependencies

   ```bash
   npm install
   ```

2. Jalankan aplikasi

   ```bash
   npx expo start
   ```

3. Buka di perangkat

- Expo Go (scan QR)
- Android emulator
- iOS simulator

## Catatan Implementasi

- Database dibuat otomatis saat aplikasi pertama kali dibuka.
- Tabel utama: users dan tasks.
- Refresh data dilakukan lewat useFocusEffect saat layar aktif kembali.
- Grafik dibungkus ScrollView horizontal agar label tanggal tetap terbaca.
