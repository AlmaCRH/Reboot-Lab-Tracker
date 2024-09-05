<template>
  <div>
    <select v-if="type === 'select'" name="pets" :type="type" v-model="input">
      <option value="SCE-6">SCE-6</option>
      <option value="SCE-5">SCE-5</option>
    </select>
    <input v-else :type="type" v-model="input" />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  type: String,
});

const input = ref("");
const emit = defineEmits(["value"]);

watch(input, (value) => {
  emit("value", value);
});
console.log(input);
</script>
