<template>
  <form @submit.prevent="handleSubmit">
    <h3>Buat Transaksi</h3>

    <div
      v-for="(item, index) in items"
      :key="index"
      style="margin-bottom:15px; border:1px solid #ccc; padding:10px;"
    >
      <!-- 1. Pilih Produk -->
      <div>
        <label>Produk:</label>
        <select v-model="item.product_name" @change="onProductChange(item)">
          <option :value="null">-- Pilih Produk --</option>
          <option v-for="p in productOptions" :key="p.name" :value="p.name">
            {{ p.name }}
          </option>
        </select>
      </div>

      <!-- 2. Pilih Brand -->
      <div v-if="item.brandOptions.length">
        <label>Brand:</label>
        <select v-model="item.brand" @change="onBrandChange(item)">
          <option :value="null">-- Pilih Brand --</option>
          <option v-for="b in item.brandOptions" :key="b" :value="b">
            {{ b }}
          </option>
        </select>
      </div>

      <!-- 3. Pilih Volume/Gram -->
      <div v-if="item.volumeOptions.length">
        <label>Volume/Gram:</label>
        <select v-model="item.volume" @change="onVolumeChange(item)">
          <option :value="null">-- Pilih Volume --</option>
          <option v-for="v in item.volumeOptions" :key="v" :value="v">
            {{ v }}
          </option>
        </select>
      </div>

      <!-- Info Produk -->
      <div
        v-if="item.selectedProduct"
        style="margin-top:5px; padding:5px; border-top:1px dashed #aaa;"
      >
        <div>Harga: {{ item.price }}</div>
        <div>Stock: {{ item.stock }}</div>
        <div v-if="item.rpm && item.rpm.length">
          RPM: {{ item.rpm.join(', ') }}
        </div>
      </div>

      <!-- Qty -->
      <div>
        <label>Qty:</label>
        <input type="number" v-model.number="item.qty" min="1" />
      </div>

      <div>
        Subtotal: {{ (item.qty * (item.price || 0)).toFixed(2) }}
      </div>

      <button type="button" @click="removeItem(index)">
        Hapus Item
      </button>
    </div>

    <button type="button" @click="addItem">Tambah Item</button>

    <div style="margin-top:10px;">
      Total: {{ total.toFixed(2) }}
    </div>

    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import Swal from 'sweetalert2'
import { ref, computed, onMounted } from 'vue'
import api from '../api'

const items = ref([])
const products = ref([])
const productOptions = ref([])

onMounted(async () => {
  try {
    const res = await api.get('/products')
    products.value = res.data.data
    generateProductOptions()
    addItem()
  } catch (e) {
    console.error("Gagal ambil produk:", e)
  }
})

/* =========================
   Generate Produk Unique
========================= */
function generateProductOptions() {
  const map = new Set()
  const unique = []

  products.value.forEach(p => {
    if (!map.has(p.name)) {
      map.add(p.name)
      unique.push(p)
    }
  })

  productOptions.value = unique
}

/* =========================
   Item Management
========================= */
function addItem() {
  items.value.push({
    product_name: null,
    brand: null,
    volume: null,
    brandOptions: [],
    volumeOptions: [],
    selectedProduct: null,
    price: 0,
    stock: 0,
    rpm: [],
    qty: 1
  })
}

function removeItem(index) {
  items.value.splice(index, 1)
}

/* =========================
   Step 1 - Product
========================= */
function onProductChange(item) {
  item.brand = null
  item.volume = null
  item.selectedProduct = null
  item.price = 0
  item.stock = 0
  item.rpm = []
  item.volumeOptions = []

  const brands = products.value
    .filter(p => p.name === item.product_name)
    .map(p => p.brand)

  item.brandOptions = [...new Set(brands)]
}

/* =========================
   Step 2 - Brand
========================= */
function onBrandChange(item) {
  item.volume = null
  item.selectedProduct = null
  item.price = 0
  item.stock = 0
  item.rpm = []

  const filteredProducts = products.value.filter(
    p => p.name === item.product_name && p.brand === item.brand
  )

  // Generate volume options kalau ada
  const volumes = filteredProducts
    .map(p => p.volume ? p.volume : (p.gram ? p.gram + " g" : null))
    .filter(v => v)

  item.volumeOptions = [...new Set(volumes)]

  // 🔥 Kalau tidak ada volume (contoh: Oli Gardan)
  if (item.volumeOptions.length === 0 && filteredProducts.length === 1) {
    const product = filteredProducts[0]

    item.selectedProduct = product
    item.price = product.price
    item.stock = product.stock
    item.rpm = product.rpm || []
  }
}


/* =========================
   Step 3 - Volume
========================= */
function onVolumeChange(item) {
  const product = products.value.find(p => {
    const vol = p.volume ? p.volume : (p.gram ? p.gram + " g" : null)

    return (
      p.name === item.product_name &&
      p.brand === item.brand &&
      vol === item.volume
    )
  })

  if (product) {
    item.selectedProduct = product
    item.price = product.price
    item.stock = product.stock
    item.rpm = product.rpm || []
  }
}

/* =========================
   Total
========================= */
const total = computed(() => {
  return items.value.reduce((sum, i) => {
    return sum + i.qty * (i.price || 0)
  }, 0)
})

/* =========================
   Submit
========================= */
async function handleSubmit() {
  try {
    const details = items.value.map(i => ({
      product_id: i.selectedProduct?.id,
      qty: i.qty,
      price: i.price
    }))

    const payload = { details }

    const res = await api.post('/transactions', payload)

 Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'success',
  title: 'Transaksi berhasil 🚀',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#f8fafc',
  color: '#0f172a',
  showClass: {
    popup: 'animate__animated animate__fadeInRight'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutRight'
  }
})



    items.value = []
    addItem()
  } catch (e) {
   Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'error',
  title: e.response?.data?.error || "Terjadi kesalahan",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true
})


    console.error(e)
  }
}
</script>

<style scoped>
/* ================================
   GLOBAL
================================ */
body {
  font-family: 'Segoe UI', Tahoma, sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  margin: 0;
  padding: 0;
  color: #1e293b;
}

/* ================================
   FORM CONTAINER
================================ */
form {
  max-width: 900px;
  margin: 40px auto;
  background: #ffffff;
  padding: 30px;
  border-radius: 18px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.6s ease-in-out;
}

form h3 {
  margin-bottom: 25px;
  font-size: 22px;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
}

/* ================================
   ITEM CARD
================================ */
form > div > div {
  border-radius: 14px !important;
  border: none !important;
}

form > div > div[style] {
  background: #f8fafc;
  padding: 20px !important;
  border-radius: 14px !important;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

form > div > div[style]:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

/* ================================
   LABEL & INPUT
================================ */
label {
  font-size: 13px;
  font-weight: 600;
  display: block;
  margin-bottom: 5px;
  color: #334155;
}

select,
input[type="number"] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  outline: none;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

select:focus,
input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
}

/* ================================
   INFO PRODUK BOX
================================ */
form div div[style*="dashed"] {
  background: #e0f2fe;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  margin-top: 8px;
}

/* ================================
   SUBTOTAL & TOTAL
================================ */
form > div:last-of-type {
  font-size: 18px;
  font-weight: bold;
  text-align: right;
  margin-top: 15px;
  color: #0f172a;
}

/* ================================
   BUTTON
================================ */
button {
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 10px;
}

button[type="button"] {
  background: #e2e8f0;
  color: #1e293b;
}

button[type="button"]:hover {
  background: #cbd5e1;
  transform: scale(1.03);
}

button[type="submit"] {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  width: 100%;
  margin-top: 20px;
}

button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37,99,235,0.4);
}

/* ================================
   TAMBAH ITEM BUTTON
================================ */
button[type="button"]:first-of-type {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

button[type="button"]:first-of-type:hover {
  box-shadow: 0 8px 20px rgba(16,185,129,0.4);
}

/* ================================
   ANIMATION
================================ */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>