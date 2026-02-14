<template>
  <div class="history-container">
    <h2>Riwayat Transaksi</h2>

    <!-- DELETE ALL BUTTON -->
    <button
      v-if="transactions.length > 0"
      class="btn-delete-all"
      @click="openDeleteAllModal"
    >
      🗑 Hapus Semua Transaksi
    </button>

    <!-- EMPTY STATE -->
    <div v-if="transactions.length === 0" class="empty-state">
      Belum ada transaksi.
    </div>

    <!-- TRANSACTION CARD -->
    <div
      v-for="tx in transactions"
      :key="tx.id"
      class="transaction-card"
    >
      <div class="transaction-header">
        <div><strong>ID:</strong> {{ tx.id }}</div>
        <div><strong>Tanggal:</strong> {{ formatDate(tx.date) }}</div>
        <div><strong>Total:</strong> Rp {{ formatCurrency(tx.total) }}</div>

        <button
          class="btn-delete"
          @click="openDeleteOneModal(tx.id)"
        >
          Hapus
        </button>
      </div>

      <table class="detail-table">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Brand</th>
            <th>Spesifikasi</th>
            <th>Qty</th>
            <th>Harga</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="d in tx.details" :key="d.id">
            <td>{{ d.product_name }}</td>
            <td>{{ d.brand }}</td>

            <td>
              <span v-if="d.volume">
                {{ d.volume }}
              </span>

              <span v-else-if="d.gram">
                {{ d.gram }} g
              </span>

              <span v-else-if="d.rpm && d.rpm.length">
                {{ d.rpm.join(' / ') }} RPM
              </span>

              <span v-else>-</span>
            </td>

            <td>{{ d.qty }}</td>
            <td>Rp {{ formatCurrency(d.price) }}</td>
            <td>Rp {{ formatCurrency(d.subtotal) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ========================= -->
    <!-- DELETE ONE MODAL -->
    <!-- ========================= -->
    <transition name="fade">
      <div v-if="showDeleteOneModal" class="modal-overlay">
        <div class="modal-box">
          <h3>⚠ Hapus Transaksi?</h3>
          <p>Data ini tidak bisa dikembalikan.</p>

          <div class="modal-actions">
            <button class="btn-cancel" @click="closeDeleteOneModal">
              Batal
            </button>
            <button class="btn-confirm" @click="confirmDeleteOne">
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ========================= -->
    <!-- DELETE ALL MODAL -->
    <!-- ========================= -->
    <transition name="fade">
      <div v-if="showDeleteAllModal" class="modal-overlay">
        <div class="modal-box">
          <h3>🔥 Hapus Semua Transaksi?</h3>
          <p>Semua data akan hilang permanen.</p>

          <div class="modal-actions">
            <button class="btn-cancel" @click="closeDeleteAllModal">
              Batal
            </button>
            <button class="btn-confirm" @click="confirmDeleteAll">
              Ya, Hapus Semua
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const transactions = ref([])

const showDeleteOneModal = ref(false)
const showDeleteAllModal = ref(false)

const selectedId = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/transactions')
    transactions.value = res.data.data
  } catch (err) {
    console.error("Gagal mengambil transaksi:", err)
  }
})

function formatDate(date) {
  return new Date(date).toLocaleString('id-ID')
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID').format(value)
}

/* =========================
   DELETE ONE
========================= */

function openDeleteOneModal(id) {
  selectedId.value = id
  showDeleteOneModal.value = true
}

function closeDeleteOneModal() {
  showDeleteOneModal.value = false
  selectedId.value = null
}

async function confirmDeleteOne() {
  try {
    await api.delete(`/transactions/${selectedId.value}`)
    transactions.value = transactions.value.filter(
      tx => tx.id !== selectedId.value
    )
    closeDeleteOneModal()
  } catch (err) {
    console.error("Gagal hapus transaksi:", err)
  }
}

/* =========================
   DELETE ALL
========================= */

function openDeleteAllModal() {
  showDeleteAllModal.value = true
}

function closeDeleteAllModal() {
  showDeleteAllModal.value = false
}

async function confirmDeleteAll() {
  try {
    await api.delete('/transactions')
    transactions.value = []
    closeDeleteAllModal()
  } catch (err) {
    console.error("Gagal hapus semua transaksi:", err)
  }
}
</script>

<style scoped>

/* CONTAINER */
.history-container {
  min-height: 100vh;
  padding: 120px 40px 40px 40px;
  background: radial-gradient(circle at top, #1a1a1a 0%, #000 80%);
  color: white;
}

.history-container h2 {
  font-size: 32px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #ff0000;
  text-shadow: 0 0 10px red;
  margin-bottom: 30px;
  text-align: center;
}

/* BUTTONS */
.btn-delete-all,
.btn-delete {
  background: linear-gradient(90deg, #660000, #ff0000);
  border: none;
  padding: 10px 15px;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.btn-delete-all:hover,
.btn-delete:hover {
  box-shadow: 0 0 20px red;
  transform: scale(1.05);
}

/* CARD */
.transaction-card {
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 0, 0, 0.2);
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.15);
}

.transaction-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: #ff4d4d;
}

/* TABLE */
.detail-table {
  width: 100%;
  border-collapse: collapse;
}

.detail-table thead {
  background: linear-gradient(90deg, #990000, #ff0000);
}

.detail-table th,
.detail-table td {
  padding: 10px;
  text-align: center;
}

/* EMPTY */
.empty-state {
  text-align: center;
  margin-top: 50px;
  color: #aaa;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: #111;
  padding: 30px;
  border-radius: 20px;
  width: 400px;
  text-align: center;
  border: 1px solid rgba(255,0,0,0.3);
  box-shadow: 0 0 40px rgba(255,0,0,0.4);
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel {
  flex: 1;
  background: #333;
  border: none;
  padding: 10px;
  border-radius: 10px;
  color: white;
}

.btn-confirm {
  flex: 1;
  background: linear-gradient(90deg, #660000, #ff0000);
  border: none;
  padding: 10px;
  border-radius: 10px;
  color: white;
  font-weight: bold;
}

/* ANIMATION */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
