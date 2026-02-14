<template>
  <div class="report-container">
    <h2>Grafik Penghasilan</h2>

    <div class="filter">
      <button @click="loadDaily">Harian</button>
      <button @click="loadWeekly">Mingguan</button>
      <button @click="loadMonthly">Bulanan</button>
    </div>

    <div class="chart-wrapper">
      <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
      <p v-else class="empty">Belum ada data</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import api from '../api'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
)

/*
========================================
STATE
========================================
*/

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Penghasilan',
      backgroundColor: '#ff0000',
      data: []
    }
  ]
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true }
  }
}

/*
========================================
FETCH FUNCTIONS
========================================
*/

async function loadDaily() {
  try {
    const res = await api.get('/transactions/report/daily')
    setChart(res?.data?.data)
  } catch (err) {
    console.error("Daily error:", err)
    resetChart()
  }
}

async function loadWeekly() {
  try {
    const res = await api.get('/transactions/report/weekly')
    setChart(res?.data?.data)
  } catch (err) {
    console.error("Weekly error:", err)
    resetChart()
  }
}

async function loadMonthly() {
  try {
    const res = await api.get('/transactions/report/monthly')
    setChart(res?.data?.data)
  } catch (err) {
    console.error("Monthly error:", err)
    resetChart()
  }
}

/*
========================================
HELPERS
========================================
*/

function setChart(data) {
  if (!Array.isArray(data) || data.length === 0) {
    resetChart()
    return
  }

  chartData.value = {
    labels: data.map(d => d.label),
    datasets: [
      {
        label: 'Penghasilan',
        backgroundColor: '#ff0000',
        data: data.map(d => Number(d.total) || 0)
      }
    ]
  }
}

function resetChart() {
  chartData.value = {
    labels: [],
    datasets: [
      {
        label: 'Penghasilan',
        backgroundColor: '#ff0000',
        data: []
      }
    ]
  }
}

/*
========================================
AUTO LOAD
========================================
*/

onMounted(() => {
  loadDaily()
})
</script>

<style scoped>
.report-container {
  min-height: 100vh;
  padding: 120px 40px 40px;
  background: #111;
  color: white;
}

.filter {
  margin-bottom: 30px;
  text-align: center;
}

.filter button {
  margin: 0 10px;
  padding: 10px 20px;
  background: red;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.3s;
}

.filter button:hover {
  background: #ff4d4d;
}

.chart-wrapper {
  background: #1a1a1a;
  padding: 30px;
  border-radius: 15px;
  min-height: 400px;
}

.empty {
  text-align: center;
  color: #aaa;
  margin-top: 100px;
  font-size: 18px;
}
</style>
