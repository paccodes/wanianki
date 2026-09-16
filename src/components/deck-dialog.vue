<script setup lang="ts">
import { ref } from "vue";

import { deleteIconPath } from "../icon-paths";
import type { Deck } from "../types";
import { getPluralizedQuantity } from "../utils";

import BaseButton from "./base-button.vue";
import BaseDialog from "./base-dialog.vue";
import BaseIcon from "./base-icon.vue";

defineProps<{
  decks: Deck[];
  hasSelection: boolean;
}>();

const emit = defineEmits<{
  load: [deckId: string, subjectIds: number[]];
  remove: [id: string];
  save: [name: string];
}>();

const baseDialogRef = ref<InstanceType<typeof BaseDialog> | null>(null);
const newDeckName = ref<string>("");

const handleOpen = () => {
  baseDialogRef.value?.open();
};

const handleClose = () => {
  baseDialogRef.value?.close();
};

const handleSave = () => {
  const trimmedName = newDeckName.value.trim();

  if (trimmedName) {
    emit("save", trimmedName);

    newDeckName.value = "";

    handleClose();
  }
};

const handleLoad = (deckId: string, subjectIds: number[]) => {
  emit("load", deckId, subjectIds);

  handleClose();
};

const handleRemove = (id: string) => {
  emit("remove", id);
};

defineExpose({
  open: handleOpen,
  close: handleClose,
});
</script>

<template>
  <base-dialog ref="baseDialogRef" title="Saved Review Decks" width="500px">
    <div class="save-section">
      <input
        v-model="newDeckName"
        class="deck-input"
        placeholder="New deck name..."
        aria-label="New deck name"
        @keyup.enter="handleSave"
      />
      <base-button
        size="small"
        :disabled="!hasSelection || !newDeckName.trim()"
        @click="handleSave"
      >
        Save Current
      </base-button>
    </div>
    <ul v-if="decks.length > 0" class="deck-list" role="list">
      <li v-for="deck in decks" :key="deck.id" class="deck-item">
        <button
          class="deck-name"
          :aria-label="`Load deck ${deck.name}`"
          @click="handleLoad(deck.id, deck.subjectIds)"
        >
          {{ deck.name }}
          <span class="deck-count">
            ({{ getPluralizedQuantity("item", deck.subjectIds.length) }})
          </span>
        </button>
        <button
          class="remove-button"
          title="Remove deck"
          :aria-label="`Remove deck ${deck.name}`"
          @click="handleRemove(deck.id)"
        >
          <base-icon :path="deleteIconPath" width="20px" height="20px" />
        </button>
      </li>
    </ul>
    <p v-else class="empty-message">No saved decks yet.</p>
    <template #footer>
      <base-button @click="handleClose">Close</base-button>
    </template>
  </base-dialog>
</template>

<style scoped>
.save-section {
  display: flex;
  margin-bottom: 20px;
  gap: 12px;
}

.deck-input {
  flex: 1;
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: var(--background-color-1);
  color: var(--foreground-color-0);
  font-family: inherit;
  font-size: 0.9rem;
  transition: var(--transition-base);
}

.deck-input:focus {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-glow) var(--primary-color-glow);
  outline: none;
}

.deck-input::placeholder {
  color: var(--muted-color);
}

.deck-list {
  display: flex;
  max-height: 300px;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: 8px;
  list-style: none;
  overflow-y: auto;
}

.deck-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: var(--background-color-1);
  transition: var(--transition-base);
}

.deck-item:hover {
  border-color: var(--primary-color);
}

.deck-name {
  flex: 1;
  padding: 0;
  border: none;
  background: none;
  color: var(--foreground-color-0);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.95rem;
  text-align: left;
}

.deck-name:hover {
  color: var(--primary-color);
}

.deck-count {
  margin-left: 8px;
  color: var(--muted-color);
  font-size: 0.85rem;
}

.remove-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--muted-color);
  cursor: pointer;
  transition: var(--transition-base);
}

.remove-button:hover {
  background: var(--background-color-2);
  color: var(--error-color);
}

.empty-message {
  margin: 0;
  color: var(--muted-color);
  font-size: 0.95rem;
  text-align: center;
}

@media (width >= 1024px) {
  .deck-list {
    max-height: 400px;
  }
}

@media (width <= 768px) {
  .save-section {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
