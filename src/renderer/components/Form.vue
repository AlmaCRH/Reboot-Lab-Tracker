<template>
  <div>
    <label>
      <select name="bootcamps" v-model="select">
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
      <input type="text" v-model="input" />
    </lable>
    <button @click="sendData">Send</button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  bootcamps: Array,
});

const emit = defineEmits(["value"]);
const select = ref("");
const input = ref("");

watch(input, (value) => {
  emit("value", value);
});

const sendData = () => {
  window.electron.ipcRenderer.send("data", select.value, input.value);
};
</script>
