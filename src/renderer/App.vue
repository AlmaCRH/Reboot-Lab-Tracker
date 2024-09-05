<template>
  <div>
    <h1>Welcome to the Lab Tracker by Reboot Academy</h1>
    <label
      >First, we need the id of the spreadsheet you want to fill:
      <Input type="text" @value="(value) => (text = value)" />
    </label>
    <label>
      Now, select your team
      <Input type="select" @value="(value) => (text = value)" />
    </label>
    <button type="submit" @click="() => console.log(text)">Submit</button>
    {{ a() }}
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Input from "./components/Input.vue";
const text = ref("");
const a = async () => {
  try {
    await window.electron.ipcRenderer.invoke("myChannel", "hola");
  } catch (error) {
    console.error(error);
  }
};
/* onMounted(() => {
  window.electron.ipcRenderer.once("myChannel", (arg) => {
    text.value = arg; // Update the message with the received data
    console.log("Received:", arg);
  });
}); */
/* window.electron.ipcRenderer.receive(
  "myChannel",
  (value) => (text.value = value)
); */
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
