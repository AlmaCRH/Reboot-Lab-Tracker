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
  </div>
</template>

<script setup>
import { ref } from "vue";

import Input from "./components/Input.vue";
const text = ref("");
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
