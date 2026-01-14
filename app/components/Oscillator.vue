<template>
  <div class="space-y-2">
    <p class="text-sm">Oscillator Type</p>

    <Select v-model="internalValue">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Select an Oscillator" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Oscillator</SelectLabel>
          <SelectItem value="sine">Sine</SelectItem>
          <SelectItem value="triangle">Triangle</SelectItem>
          <SelectItem value="square">Square</SelectItem>
          <SelectItem value="sawtooth">Sawtooth</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "sine",
  },
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue);

// keep internal value synced with parent
watch(internalValue, (val) => emit("update:modelValue", val));
watch(() => props.modelValue, (val) => (internalValue.value = val));
</script>
