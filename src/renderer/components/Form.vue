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
      Block:
      <select name="blocks" v-model="blockSelect">
        <option value=""></option>
        <option value="BLOCK 1">BLOCK 1</option>
        <option value="BLOCK 2">BLOCK 2</option>
        <option value="BLOCK 3">BLOCK 3</option>
      </select>
    </lable>
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

const bootcampSelect = ref("");
const labSelect = ref("");
const blockSelect = ref("");

const sendData = () => {
  const frontData = {
    bootcamp: bootcampSelect.value,
    lab: labSelect.value,
    block: blockSelect.value,
  };
  window.electron.ipcRenderer.send("frontChannel", frontData);
};
</script>
