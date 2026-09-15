<script setup lang="ts">
import { computed } from "vue";

import { useLeeches } from "../composables";
import { flagFilledIconPath, flagIconPath } from "../icon-paths";

import BaseIcon from "./base-icon.vue";

const {
  subjectId,
  label = "",
  size = "16px",
} = defineProps<{
  subjectId: number;
  label?: string;
  size?: string;
}>();

const { isManualLeech, toggleManualLeech } = useLeeches();

const isFlagged = computed<boolean>(() => isManualLeech(subjectId));

const title = computed<string>(() =>
  isFlagged.value ? "Remove leech flag" : "Flag as leech",
);

const ariaLabel = computed<string>(() => {
  const action = isFlagged.value ? "Remove leech flag from" : "Flag as leech";

  return label ? `${action} ${label}` : title.value;
});
</script>

<template>
  <button
    type="button"
    class="leech-flag"
    :class="{ flagged: isFlagged }"
    :title="title"
    :aria-label="ariaLabel"
    :aria-pressed="isFlagged"
    @click="toggleManualLeech(subjectId)"
  >
    <base-icon
      :path="isFlagged ? flagFilledIconPath : flagIconPath"
      :width="size"
      :height="size"
    />
  </button>
</template>

<style scoped>
.leech-flag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--muted-color);
  cursor: pointer;
  transition: var(--transition-fast);
}

.leech-flag:hover {
  background: var(--background-color-2);
  color: var(--primary-color);
}

.leech-flag.flagged {
  color: var(--primary-color);
}
</style>
