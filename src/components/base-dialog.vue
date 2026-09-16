<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    title: string;
    width?: string;
  }>(),
  {
    width: "400px",
  },
);

const dialogRef = ref<HTMLDialogElement | null>(null);

const open = () => {
  dialogRef.value?.showModal();
};

const close = () => {
  dialogRef.value?.close();
};

defineExpose<{
  open: typeof open;
  close: typeof close;
}>({ open, close });
</script>

<template>
  <dialog ref="dialogRef" class="dialog" @click="close">
    <div class="dialog-content" @click.stop>
      <header class="dialog-header">
        <span>{{ title }}</span>
      </header>
      <section class="dialog-body">
        <slot></slot>
      </section>
      <footer class="dialog-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
.dialog {
  overflow: hidden;
  width: v-bind("props.width");
  max-width: calc(100vw - 48px);
  max-height: calc(100dvh - 48px);
  padding: 0;
  border: none;
  border-radius: var(--radius-lg);
  background: transparent;
}

.dialog::backdrop {
  backdrop-filter: blur(4px);
  background: var(--overlay-color);
}

.dialog-content {
  --dialog-inline-padding: 40px;

  display: flex;
  overflow: hidden;
  max-height: inherit;
  flex-direction: column;
  padding: 32px var(--dialog-inline-padding);
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-lg);
  background: linear-gradient(
    180deg,
    var(--background-color-2) 0%,
    var(--background-color-1) 100%
  );
  box-shadow:
    var(--shadow-lg),
    0 0 60px var(--overlay-color);
  color: var(--foreground-color-0);
}

.dialog-header {
  display: flex;
  flex-shrink: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--background-color-3);
  font-size: 1.3rem;
  font-weight: 700;
}

.dialog-body {
  min-height: 0;
  padding: 24px var(--dialog-inline-padding);
  margin-inline: calc(-1 * var(--dialog-inline-padding));
  overflow-y: auto;
}

.dialog-footer {
  display: flex;
  flex-shrink: 0;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid var(--background-color-3);
  gap: 12px;
}

@media (width <= 768px) {
  .dialog {
    width: calc(100vw - 48px);
    max-width: 500px;
  }

  .dialog-content {
    --dialog-inline-padding: 24px;

    padding: 24px;
  }

  .dialog-header {
    padding-bottom: 12px;
    font-size: 1.1rem;
  }

  .dialog-body {
    padding: 16px var(--dialog-inline-padding);
  }

  .dialog-footer {
    padding-top: 12px;
  }
}

@media (width <= 480px) {
  .dialog {
    width: calc(100vw - 32px);
  }

  .dialog-content {
    --dialog-inline-padding: 16px;

    padding: 16px;
  }

  .dialog-header {
    padding-bottom: 10px;
    font-size: 1rem;
  }

  .dialog-body {
    padding: 12px var(--dialog-inline-padding);
  }

  .dialog-footer {
    padding-top: 10px;
  }
}
</style>
