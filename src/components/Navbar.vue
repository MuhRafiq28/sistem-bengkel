<template>
  <nav :class="['navbar', { scrolled: isScrolled }]">
    <div class="logo">CJM<span style="margin-left: 20px; color: aliceblue;">cikal jaya motor</span></div>

    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/products">Products</router-link></li>
      <li><router-link to="/transactions">Transactions</router-link></li>
      <li><router-link to="/transaction-history">History</router-link></li>
      <li><router-link to="/report">Report</router-link></li>
      <li><button class="cta-btn">Sign Up</button></li>
    </ul>

    <!-- Hamburger Mobile -->
    <div class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </div>

    <!-- Mobile Menu -->
    <ul class="mobile-menu" v-if="menuOpen">
      <li><router-link to="/" @click="menuOpen = false">Home</router-link></li>
      <li><router-link to="/products" @click="menuOpen = false">Products</router-link></li>
      <li><router-link to="/transactions" @click="menuOpen = false">Transactions</router-link></li>
      <li><router-link to="/transaction-history" @click="menuOpen = false">History</router-link></li>
      <li><router-link to="/report" @click="menuOpen = false">Report</router-link></li>
      <li><button class="cta-btn">Sign Up</button></li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const menuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
}

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<style scoped>

/* ===============================
   NAVBAR BASE
================================= */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 18px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  z-index: 1000;
}

/* Saat Scroll */
.navbar.scrolled {
  background: #000;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
}

/* ===============================
   LOGO
================================= */
.logo {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 3px;
  color: #ff0000;
  text-shadow: 0 0 10px red;
  cursor: pointer;
}

.logo span {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* ===============================
   NAV LINKS
================================= */
.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-links li {
  position: relative;
}

.nav-links a {
  text-decoration: none;
  color: white;
  font-weight: 600;
  letter-spacing: 1px;
  transition: 0.3s ease;
  position: relative;
}

/* Underline racing */
.nav-links a::after {
  content: "";
  position: absolute;
  width: 0%;
  height: 2px;
  background: #ff0000;
  bottom: -5px;
  left: 0;
  transition: 0.3s ease;
}

.nav-links a:hover {
  color: #ff0000;
}

.nav-links a:hover::after {
  width: 100%;
}

/* ===============================
   CTA BUTTON
================================= */
.cta-btn {
  background: linear-gradient(45deg, #ff0000, #990000);
  border: none;
  padding: 10px 22px;
  border-radius: 25px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
}

.cta-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(255, 0, 0, 0.8);
}

/* ===============================
   HAMBURGER
================================= */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 6px;
}

.hamburger span {
  width: 28px;
  height: 3px;
  background: #ff0000;
  transition: 0.3s;
  box-shadow: 0 0 6px red;
}

/* ===============================
   MOBILE MENU
================================= */
.mobile-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  background: #000;
  list-style: none;
  padding: 20px 0;
  text-align: center;
  animation: slideDown 0.3s ease;
}

.mobile-menu li {
  margin: 15px 0;
}

.mobile-menu a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.mobile-menu a:hover {
  color: #ff0000;
}

/* ===============================
   RESPONSIVE
================================= */
@media (max-width: 900px) {
  .nav-links {
    display: none;
  }

  .hamburger {
    display: flex;
  }
}

/* ===============================
   ANIMATION
================================= */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
