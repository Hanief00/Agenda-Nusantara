import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import db from '../database/db';

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation }) {
  const [selesai, setSelesai] = useState(0);
  const [belumSelesai, setBelumSelesai] = useState(0);
  
  const [chartLabels, setChartLabels] = useState(["Belum Ada"]);
  const [chartData, setChartData] = useState([0]);

  const loadStats = () => {
    try {
      const resultSelesai = db.getFirstSync('SELECT COUNT(*) as total FROM tasks WHERE status = 1');
      setSelesai(resultSelesai.total || 0);

      const resultBelum = db.getFirstSync('SELECT COUNT(*) as total FROM tasks WHERE status = 0');
      setBelumSelesai(resultBelum.total || 0);

      // Kueri diubah: Menghapus LIMIT agar semua data tanggal tugas selesai ikut terambil
      const chartQuery = db.getAllSync('SELECT dueDate, COUNT(*) as count FROM tasks WHERE status = 1 GROUP BY dueDate ORDER BY id ASC');
      
      if (chartQuery && chartQuery.length > 0) {
        const labels = chartQuery.map(item => item.dueDate.substring(0, 6));
        const dataCounts = chartQuery.map(item => item.count);
        setChartLabels(labels);
        setChartData(dataCounts);
      } else {
        setChartLabels(["Belum Ada"]);
        setChartData([0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const getTodayDate = () => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const today = new Date();
    return `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  };

  const handleAddBiasa = () => navigation.navigate('AddTask', { type: 'Biasa' });
  const handleAddPenting = () => navigation.navigate('AddTask', { type: 'Penting' });
  const handleList = () => navigation.navigate('TaskList');
  const handleSettings = () => navigation.navigate('Settings');

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    barPercentage: 0.6,
    decimalPlaces: 0,
  };

  // Lebar grafik dinamis: Jika datanya sedikit, gunakan lebar layar. Jika banyak, kalikan dengan 70px per data agar bisa di-scroll
  const dynamicChartWidth = Math.max(screenWidth - 80, chartLabels.length * 70);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Halo, User!</Text>
        <Text style={styles.date}>{getTodayDate()}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: '#e8f4f8' }]}>
          <Text style={styles.statLabel}>TUGAS SELESAI</Text>
          <Text style={[styles.statNumber, { color: '#3498db' }]}>{selesai}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#fbeeed' }]}>
          <Text style={styles.statLabel}>BELUM SELESAI</Text>
          <Text style={[styles.statNumber, { color: '#e74c3c' }]}>{belumSelesai}</Text>
        </View>
      </View>

      <View style={styles.bonusBox}>
        <Text style={styles.bonusText}>TUGAS SELESAI / HARI [BONUS]</Text>
        {/* Grafik dibungkus dengan ScrollView Horizontal */}
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <BarChart
            data={{
              labels: chartLabels,
              datasets: [{ data: chartData }]
            }}
            width={dynamicChartWidth}
            height={180}
            yAxisLabel=""
            chartConfig={chartConfig}
            style={{ marginVertical: 15, borderRadius: 8 }}
            showValuesOnTopOfBars={true}
            fromZero={true}
          />
        </ScrollView>
      </View>

      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuButton} onPress={handleAddBiasa}>
          <View style={[styles.iconCircle, { backgroundColor: '#2ecc71' }]}>
            <FontAwesome5 name="plus" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Tambah{'\n'}Tugas Biasa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleAddPenting}>
          <View style={[styles.iconCircle, { backgroundColor: '#e74c3c' }]}>
            <MaterialCommunityIcons name="alert-plus" size={28} color="#fff" />
          </View>
          <Text style={styles.menuText}>Tambah{'\n'}Tugas Penting</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleList}>
          <View style={[styles.iconCircle, { backgroundColor: '#f39c12' }]}>
            <FontAwesome5 name="list-ul" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Daftar{'\n'}Tugas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleSettings}>
          <View style={[styles.iconCircle, { backgroundColor: '#9b59b6' }]}>
            <FontAwesome5 name="cog" size={24} color="#fff" />
          </View>
          <Text style={styles.menuText}>Pengaturan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { marginTop: 40, marginBottom: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#2c3e50' },
  date: { fontSize: 16, color: '#7f8c8d', marginTop: 5 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { flex: 1, padding: 20, borderRadius: 15, alignItems: 'center', marginHorizontal: 5 },
  statLabel: { fontSize: 12, fontWeight: 'bold', color: '#7f8c8d', textAlign: 'center' },
  statNumber: { fontSize: 36, fontWeight: 'bold', marginTop: 10 },
  bonusBox: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 30, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  bonusText: { fontSize: 12, fontWeight: 'bold', color: '#7f8c8d', marginBottom: 5 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingBottom: 40 },
  menuButton: { width: '48%', backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  menuText: { textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#2c3e50' }
});