<template>
  <div>
    <label>
      Bootcamp:
      <select name="bootcamps" v-model="bootcampSelect">
        <option value=""></option>
        <option
          v-for="(bootcamp, index) in bootcamps"
          :key="index"
          :value="bootcamp.id"
        >
          {{ bootcamp.name }}
        </option>
      </select>
    </label>

    <lable>
      Lab:
      <select name="labs" v-model="labSelect">
        <option value=""></option>
        <option v-for="(lab, index) in labs" :key="index" :value="lab">
          {{ lab }}
        </option>
      </select>
    </lable>
    <button @click="sendData">Send</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  bootcamps: Array,
  labs: Array,
});

const emit = defineEmits(["value"]);
const bootcampSelect = ref("");
const labSelect = ref("");

const sendData = () => {
  window.electron.ipcRenderer.send(
    "data",
    bootcampSelect.value,
    labSelect.value
  );
};
</script>
