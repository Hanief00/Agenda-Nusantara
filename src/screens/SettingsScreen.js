import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import db from '../database/db';

export default function SettingsScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Perhatian', 'Semua field password harus diisi!');
      return;
    }

    try {
      // Cek apakah password saat ini benar untuk akun default "user"
      const user = db.getFirstSync('SELECT * FROM users WHERE username = ? AND password = ?', ['user', currentPassword]);

      if (user) {
        // Jika benar, update dengan password baru
        db.runSync('UPDATE users SET password = ? WHERE username = ?', [newPassword, 'user']);
        Alert.alert('Sukses', 'Password berhasil diubah! Silakan ingat password baru Anda.');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        Alert.alert('Gagal', 'Password saat ini salah!');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan pada database');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome5 name="chevron-left" size={20} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pengaturan</Text>
        </View>

        {/* Change Password Form */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>GANTI PASSWORD</Text>

          <Text style={styles.label}>PASSWORD SAAT INI</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <Text style={styles.label}>PASSWORD BARU</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
            <Text style={styles.buttonText}>SIMPAN PASSWORD</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer untuk menekan bagian developer ke bawah */}
        <View style={{ flex: 1 }} />

        {/* Developer Info Section */}
        <View style={styles.developerSection}>
          <Text style={styles.devTitle}>DEVELOPER</Text>
          <FontAwesome5 name="user-tie" size={70} color="#bdc3c7" style={styles.devImage} />
          <Text style={styles.devName}>Hanief Mochsin</Text>
          <Text style={styles.devNim}>NIM: 2241720181</Text>
          <Text style={styles.devRole}>DEVELOPER APLIKASI</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#f8f9fa', borderBottomWidth: 1, borderBottomColor: '#ecf0f1' },
  backButton: { marginRight: 15, padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  formContainer: { padding: 20, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#34495e', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#7f8c8d', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#2c3e50', marginBottom: 15 },
  button: { backgroundColor: '#3498db', paddingVertical: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  developerSection: { alignItems: 'center', padding: 30, backgroundColor: '#f8f9fa', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: 20 },
  devTitle: { fontSize: 14, fontWeight: 'bold', color: '#95a5a6', marginBottom: 15, letterSpacing: 2 },
  devImage: { marginBottom: 15 },
  devName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  devNim: { fontSize: 14, color: '#7f8c8d', marginBottom: 5 },
  devRole: { fontSize: 12, fontWeight: 'bold', color: '#3498db', marginTop: 5 }
});