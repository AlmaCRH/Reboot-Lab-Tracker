<template>
  <RouterView />
  <button @click="router.go(-1)">Go back</button>
</template>

<script setup>
import { RouterView } from "vue-router";
import router from "./router/router";
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
