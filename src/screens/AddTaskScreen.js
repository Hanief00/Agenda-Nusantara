import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';
import db from '../database/db';

export default function AddTaskScreen({ route, navigation }) {
  // Menerima parameter dari Beranda (menentukan apakah ini form Penting atau Biasa)
  const { type } = route.params;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Menyesuaikan warna berdasarkan tipe tugas
  const isPenting = type === 'Penting';
  const themeColor = isPenting ? '#e74c3c' : '#2ecc71';

  // Format tanggal ke Bahasa Indonesia (Contoh: 05 Mei 2026)
  const formatTanggal = (dateObj) => {
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = dateObj.getDate().toString().padStart(2, '0');
    const m = bulan[dateObj.getMonth()];
    const y = dateObj.getFullYear();
    return `${d} ${m} ${y}`;
  };

  const onChangeDate = (event, selectedDate) => {
    // Di Android, picker harus di-hide setelah klik OK
    setShowPicker(Platform.OS === 'ios'); 
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = () => {
    if (!title || !description) {
      Alert.alert('Perhatian', 'Judul dan Deskripsi tidak boleh kosong!');
      return;
    }

    try {
      // Menyimpan data ke SQLite
      db.runSync(
        'INSERT INTO tasks (title, description, dueDate, type, status) VALUES (?, ?, ?, ?, 0)',
        [title, description, formatTanggal(date), type]
      );
      
      Alert.alert('Sukses', `Tugas ${type} berhasil disimpan!`, [
        { text: 'OK', onPress: () => navigation.goBack() } // Kembali ke Beranda setelah OK
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan data tugas ke database.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header dengan tombol kembali */}
      <View style={[styles.header, { backgroundColor: themeColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Tugas {type}</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.badge, { color: themeColor, borderColor: themeColor }]}>
          {type.toUpperCase()}
        </Text>

        <Text style={styles.label}>TANGGAL JATUH TEMPO</Text>
        <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowPicker(true)}>
          <FontAwesome5 name="calendar-alt" size={16} color="#7f8c8d" />
          <Text style={styles.dateText}>{formatTanggal(date)}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <Text style={styles.label}>JUDUL TUGAS</Text>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Submit laporan"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>DESKRIPSI</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Jelaskan tugas..."
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
        />

        <TouchableOpacity style={[styles.button, { backgroundColor: themeColor }]} onPress={handleSave}>
          <Text style={styles.buttonText}>SIMPAN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50 },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  formContainer: { padding: 20 },
  badge: { alignSelf: 'flex-start', borderWidth: 1, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20, fontSize: 12, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#7f8c8d', marginBottom: 5, marginTop: 15 },
  datePickerBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12 },
  dateText: { marginLeft: 10, fontSize: 16, color: '#2c3e50' },
  input: { borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#2c3e50' },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});