import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import db from '../database/db';

export default function TaskListScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);

  // Mengambil SEMUA daftar tugas (baik status 0 maupun 1)
  const loadTasks = () => {
    try {
      const allTasks = db.getAllSync('SELECT * FROM tasks ORDER BY id DESC');
      setTasks(allTasks);
    } catch (error) {
      console.error('Gagal mengambil tugas:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  // Fungsi mengubah status tugas (toggle selesai / belum)
  const toggleTaskStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      db.runSync('UPDATE tasks SET status = ? WHERE id = ?', [newStatus, id]);
      loadTasks(); // Refresh daftar
    } catch (error) {
      Alert.alert('Error', 'Gagal mengupdate status tugas.');
    }
  };

  const renderItem = ({ item }) => {
    const isPenting = item.type === 'Penting';
    const arrowColor = isPenting ? '#e74c3c' : '#2ecc71'; 
    const isDone = item.status === 1;

    return (
      <TouchableOpacity style={styles.taskCard} onPress={() => toggleTaskStatus(item.id, item.status)}>
        {/* Ikon Checkbox */}
        <View style={styles.checkboxContainer}>
          {isDone ? (
            <View style={[styles.checkbox, { backgroundColor: '#2ecc71', borderColor: '#2ecc71' }]}>
              <FontAwesome5 name="check" size={12} color="#fff" />
            </View>
          ) : (
            <View style={styles.checkbox} />
          )}
        </View>

        <View style={styles.taskInfo}>
          {/* Teks dicoret jika sudah selesai */}
          <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>{item.title}</Text>
          <Text style={[styles.taskSubtitle, isDone && styles.taskSubtitleDone]}>
            {item.dueDate} - {item.type}
          </Text>
        </View>
        <FontAwesome5 name="play" size={16} color={arrowColor} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Tugas</Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada tugas yang ditambahkan.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 50, backgroundColor: '#3b8686' },
  backButton: { marginRight: 15, padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  listContainer: { padding: 20 },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, borderWidth: 1, borderColor: '#ecf0f1' },
  checkboxContainer: { marginRight: 15 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#bdc3c7', justifyContent: 'center', alignItems: 'center' },
  taskInfo: { flex: 1, paddingRight: 10 },
  taskTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#bdc3c7' }, // Gaya teks dicoret
  taskSubtitle: { fontSize: 12, color: '#7f8c8d' },
  taskSubtitleDone: { textDecorationLine: 'line-through', color: '#bdc3c7' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#95a5a6' }
});