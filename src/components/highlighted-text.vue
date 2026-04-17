<script setup lang="ts">
import type { getParsedText } from "../utils";

defineProps<{
  parsedText: ReturnType<typeof getParsedText>;
}>();
</script>

<template>
  <span
    v-for="(segment, index) in parsedText"
    :key="`${segment.content}-${index}`"
    :class="segment.tag"
    >{{ segment.content }}</span
  >
</template>

<style scoped>
.meaning,
.reading {
  color: var(--highlight-color);
  font-style: italic;
}

.kanji,
.radical,
.vocabulary {
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.kanji {
  border: 1px solid var(--kanji-color);
  background: linear-gradient(
    135deg,
    var(--kanji-color-transparent) 0%,
    transparent 100%
  );
}

.kanji:hover {
  box-shadow: var(--shadow-glow) var(--kanji-color-glow);
}

.radical {
  border: 1px solid var(--radical-color);
  background: linear-gradient(
    135deg,
    var(--radical-color-transparent) 0%,
    transparent 100%
  );
}

.radical:hover {
  box-shadow: var(--shadow-glow) var(--radical-color-glow);
}

.vocabulary {
  border: 1px solid var(--vocabulary-color);
  background: linear-gradient(
    135deg,
    var(--vocabulary-color-transparent) 0%,
    transparent 100%
  );
}

.vocabulary:hover {
  box-shadow: var(--shadow-glow) var(--vocabulary-color-glow);
}
</style>
