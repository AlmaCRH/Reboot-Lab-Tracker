<template>
  <div>
    <Form :bootcamps="bootcamps" />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Form from "./components/Form.vue";

const bootcamps = ref([]);
onBeforeMount(() => {
  window.electron.ipcRenderer.once("drive", (event, arg) => {
    bootcamps.value = arg;
  });
});
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
