<template>
  <div v-if="loading" class="loader"></div>

  <template v-else>
    <Form :bootcamps="bootcamps" :labs="labs" />
  </template>

</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { createRouter } from "vue-router";
import Form from "./components/Form.vue";

const bootcamps = ref([]);
const labs = ref([]);
const loading = ref(true);
onBeforeMount(() => {
  window.electron.ipcRenderer.once("drive", (event, arg) => {
    bootcamps.value = arg;
    checkLoading();
  });
  window.electron.ipcRenderer.once("github", (event, arg) => {
    labs.value = arg;
    checkLoading();
  });
});

const checkLoading = () => {
  if (bootcamps.value.length && labs.value.length) {
    loading.value = false;
  }
};
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
