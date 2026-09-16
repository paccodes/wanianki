<script setup lang="ts">
import { computed, ref } from "vue";

import type { ApiKeyPurpose } from "../types";

import BaseButton from "./base-button.vue";
import BaseDialog from "./base-dialog.vue";

interface ApiKeyPrompt {
  description: string;
  submitLabel: string;
}

const PROMPTS = {
  refresh: {
    description: "Enter your WaniKani API key to check for level changes.",
    submitLabel: "Check for Updates",
  },
  leeches: {
    description:
      "Enter your WaniKani API key to sync your review statistics and refresh your leeches.",
    submitLabel: "Sync Leeches",
  },
} satisfies Record<ApiKeyPurpose, ApiKeyPrompt>;

const emit = defineEmits<{
  submit: [apiKey: string, purpose: ApiKeyPurpose];
}>();

const baseDialogRef = ref<InstanceType<typeof BaseDialog> | null>(null);
const apiKeyInput = ref<string>("");
const apiKeyPurpose = ref<ApiKeyPurpose>("refresh");
const apiKeyPrompt = computed<ApiKeyPrompt>(() => PROMPTS[apiKeyPurpose.value]);

const handleCancel = () => {
  apiKeyInput.value = "";
  baseDialogRef.value?.close();
};

const handleSubmit = () => {
  const trimmedKey = apiKeyInput.value.trim();

  if (trimmedKey) {
    emit("submit", trimmedKey, apiKeyPurpose.value);

    handleCancel();
  }
};

const open = (purpose: ApiKeyPurpose) => {
  apiKeyInput.value = "";
  apiKeyPurpose.value = purpose;

  baseDialogRef.value?.open();
};

defineExpose({ open });
</script>

<template>
  <base-dialog ref="baseDialogRef" title="Enter your API Key">
    <p class="dialog-description">{{ apiKeyPrompt.description }}</p>
    <input
      v-model="apiKeyInput"
      type="password"
      class="api-key-input"
      placeholder="Your WaniKani API key..."
      aria-label="WaniKani API key"
      @keyup.enter="handleSubmit"
    />
    <template #footer>
      <base-button variant="secondary" @click="handleCancel">
        Cancel
      </base-button>
      <base-button :disabled="!apiKeyInput.trim()" @click="handleSubmit">
        {{ apiKeyPrompt.submitLabel }}
      </base-button>
    </template>
  </base-dialog>
</template>

<style scoped>
.dialog-description {
  margin: 0 0 16px;
  color: var(--foreground-color-1);
  font-size: 0.95rem;
}

.api-key-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: var(--background-color-1);
  color: var(--foreground-color-0);
  font-family: inherit;
  font-size: 0.9rem;
  transition: var(--transition-base);
}

.api-key-input:focus {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-glow) var(--primary-color-glow);
  outline: none;
}

.api-key-input::placeholder {
  color: var(--muted-color);
}

@media (width <= 480px) {
  .dialog-description {
    font-size: 0.9rem;
  }
}
</style>
