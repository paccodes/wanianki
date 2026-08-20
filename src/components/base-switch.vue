<script setup lang="ts">
defineProps<{
  offLabel: string;
  onLabel: string;
}>();

const checked = defineModel<boolean>();
</script>

<template>
  <div class="switch-container">
    <span>{{ offLabel }}</span>
    <label class="switch">
      <input v-model="checked" type="checkbox" />
      <span class="slider"></span>
    </label>
    <span>{{ onLabel }}</span>
  </div>
</template>

<style scoped>
.switch-container {
  display: flex;
  align-items: center;
  padding: 2px;
  color: var(--foreground-color-0);
  font-size: 0.9rem;
  gap: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-full);
  background: var(--background-color-0);
  box-shadow: inset 0 1px 3px var(--text-shadow-color);
  transition: var(--transition-base);
}

.switch:hover {
  border-color: var(--primary-color-transparent);
}

.switch:has(input:checked) {
  border-color: var(--primary-color);
  background: var(--primary-color-transparent);
  box-shadow: var(--shadow-glow) var(--primary-color-glow);
}

.switch input {
  width: 0;
  height: 0;
  opacity: 0;
}

.slider {
  position: absolute;
  border-radius: var(--radius-full);
  cursor: pointer;
  inset: 0;
  transition: var(--transition-base);
}

.slider::before {
  position: absolute;
  top: 1px;
  left: 1px;
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  background: var(--foreground-color-1);
  box-shadow: var(--shadow-sm);
  content: "";
  transition: var(--transition-base);
}

input:checked + .slider::before {
  background: var(--primary-color);
  box-shadow:
    var(--shadow-sm),
    var(--shadow-glow) var(--primary-color-glow);
  transform: translateX(20px);
}

@media (width <= 768px) {
  .switch-container {
    font-size: 0.85rem;
    gap: 8px;
  }

  .switch {
    width: 44px;
    height: 24px;
  }

  .slider::before {
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
  }

  input:checked + .slider::before {
    transform: translateX(20px);
  }
}

@media (width <= 480px) {
  .switch-container {
    font-size: 0.8rem;
    gap: 6px;
  }
}
</style>
