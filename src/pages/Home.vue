<template>
  <div class="home">
    <div class="overlay"></div>

    <div class="content">
      <h1>🔥 WELCOME RIDER 🔥</h1>
      <p>Speed • Power • Performance</p>

      <button class="btn-start">Gaskeun 🚀</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  width: 100%;
  background: radial-gradient(circle at center, #1a1a1a 0%, #000 70%);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}



/* Strip racing background */
.home::before {
  content: "";
  position: absolute;
  width: 200%;
  height: 100%;
  background: repeating-linear-gradient(
    120deg,
    transparent 0px,
    transparent 40px,
    rgba(255, 0, 0, 0.05) 40px,
    rgba(255, 0, 0, 0.05) 80px
  );
  animation: moveStrip 10s linear infinite;
}

@keyframes moveStrip {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-200px);
  }
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255,0,0,0.1), rgba(0,0,0,0.9));
}

.content {
  position: relative;
  z-index: 2;
}

h1 {
  font-size: 48px;
  letter-spacing: 4px;
  font-weight: 900;
  text-transform: uppercase;
  color: #ff0000;
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.7),
               0 0 20px rgba(255, 0, 0, 0.5);
  margin-bottom: 20px;
}

p {
  font-size: 18px;
  letter-spacing: 3px;
  color: #ccc;
  margin-bottom: 40px;
}

/* Button racing */
.btn-start {
  padding: 14px 40px;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #ff0000;
  background: transparent;
  color: #ff0000;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-start:hover {
  background: #ff0000;
  color: black;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
  transform: scale(1.05);
}
</style>
