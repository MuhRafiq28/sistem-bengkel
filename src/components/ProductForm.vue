<template>
  <form @submit.prevent="handleSubmit" class="product-form">
    <h3>{{ editMode ? 'Edit Product' : 'Add New Product' }}</h3>

    <div class="form-group">
      <label>Name</label>
      <input v-model="form.name" required />
    </div>

    <div class="form-group">
      <label>Brand</label>
      <input v-model="form.brand" required />
    </div>

    <div class="form-group">
      <label>Price</label>
      <input type="number" v-model.number="form.price" required />
    </div>

    <div class="form-group">
      <label>Stock</label>
      <input type="number" v-model.number="form.stock" required />
    </div>

    <div class="form-group" v-if="form.name.toLowerCase() === 'loler'">
      <label>Gram (optional)</label>
      <input type="number" v-model.number="form.gram" />
    </div>

    <div class="form-group" v-if="form.name.toLowerCase() === 'persentri'">
      <label>RPM (comma separated)</label>
      <input v-model="rpmString" placeholder="1000,2000,3000" />
    </div>

    <div class="form-group" v-if="form.name.toLowerCase() === 'oli mesin'">
      <label>Volume</label>
      <input v-model="form.volume" placeholder="800ml / 1L" />
    </div>

    <div class="form-buttons">
      <button type="submit" class="btn-submit">
        {{ editMode ? "Update" : "Create" }}
      </button>
      <button type="button" class="btn-cancel" @click="cancel">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  product: Object
})

const emit = defineEmits(['submit', 'cancel'])

const editMode = ref(false)

const form = ref({
  name: '',
  brand: '',
  price: 0,
  stock: 0,
  gram: null,
  rpm: [],
  volume: ''
})

const rpmString = ref('')

watch(() => props.product, (val) => {
  if (val) {
    editMode.value = true
    form.value = { ...val }
    rpmString.value = val.rpm?.join(',') || ''
  } else {
    resetForm()
  }
}, { immediate: true })

function handleSubmit() {
  form.value.rpm = rpmString.value
    ? rpmString.value.split(',').map(n => parseInt(n.trim()))
    : []

  emit('submit', { ...form.value })
}

function cancel() {
  resetForm()
  emit('cancel')
}

function resetForm() {
  editMode.value = false
  form.value = {
    name: '',
    brand: '',
    price: 0,
    stock: 0,
    gram: null,
    rpm: [],
    volume: ''
  }
  rpmString.value = ''
}
</script>
