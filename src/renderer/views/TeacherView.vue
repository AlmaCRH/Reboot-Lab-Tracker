<template>
  <div v-if="loading" class="loader"></div>
  <div v-else>
    <Form :bootcamps="bootcamps" :labs="labs" />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import Form from "../components/Form.vue";

const bootcamps = ref([]);
const labs = ref([]);
const loading = ref(true);

onBeforeMount(() => {
  window.electron.ipcRenderer.send("sendDataToFront");

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

<style lang="scss" scoped></style>
