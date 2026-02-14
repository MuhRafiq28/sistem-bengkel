<template>
  <div class="product-page">

    <button class="btn-add" @click="addNew">
      + Add New Product
    </button>

    <ProductForm
      v-if="showForm"
      :product="currentProduct"
      @submit="saveProduct"
      @cancel="cancelForm"
    />

    <div class="table-wrapper">
      <table class="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Gram</th>
            <th>RPM</th>
            <th>Volume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td>{{ p.name }}</td>
            <td>{{ p.brand || '-' }}</td>
            <td>Rp {{ p.price }}</td>
            <td>{{ p.stock }}</td>
            <td>{{ p.gram || '-' }}</td>
            <td>{{ p.rpm?.join(', ') || '-' }}</td>
            <td>{{ p.volume || '-' }}</td>
            <td>
              <button class="btn-edit" @click="editProduct(p)">
                Edit
              </button>
              <button class="btn-delete" @click="deleteProduct(p.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import ProductForm from '../components/ProductForm.vue'

const products = ref([])
const showForm = ref(false)
const currentProduct = ref(null)

async function fetchProducts() {
  try {
    const res = await api.get('/products')
    products.value = res.data.data
  } catch (e) {
    console.error(e.response?.data || e)
  }
}

function addNew() {
  currentProduct.value = null
  showForm.value = true
}

function editProduct(p) {
  currentProduct.value = p
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  currentProduct.value = null
}

async function saveProduct(data) {
  try {
    if (currentProduct.value) {
      await api.put(`/products/${currentProduct.value.id}`, data)
    } else {
      await api.post('/products', data)
    }

    cancelForm()
    await fetchProducts()
  } catch (e) {
    console.error(e.response?.data || e)
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure want to delete?")) return
  try {
    await api.delete(`/products/${id}`)
    await fetchProducts()
  } catch (e) {
    console.error(e.response?.data || e)
  }
}

onMounted(fetchProducts)
</script>
