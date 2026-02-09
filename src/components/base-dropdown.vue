<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { chevronDownIconPath } from "../icon-paths";

import BaseIcon from "./base-icon.vue";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
}

const props = defineProps<{
  options: DropdownOption[];
  label: string;
  placeholder: string;
}>();

const selectedValues = defineModel<string[]>({
  default: () => [],
});

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const displayText = computed(() => {
  if (selectedValues.value.length === 0) {
    return props.placeholder ?? "Select...";
  }

  if (selectedValues.value.length === props.options.length) {
    return "All selected";
  }

  if (selectedValues.value.length === 1) {
    return props.options.find((opt) => selectedValues.value.includes(opt.value))
      ?.label;
  }

  return `${selectedValues.value.length} selected`;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const isSelected = (value: string) => {
  return selectedValues.value.includes(value);
};

const toggleOption = (value: string) => {
  if (isSelected(value)) {
    selectedValues.value = selectedValues.value.filter(
      (selectedValue) => selectedValue !== value,
    );
  } else {
    selectedValues.value = [...selectedValues.value, value];
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeDropdown();
  }
};

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeydown);
  } else {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("keydown", handleKeydown);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div ref="dropdownRef" class="dropdown-container">
    <label v-if="label" class="dropdown-label">{{ label }}</label>
    <div class="dropdown-wrapper">
      <button
        type="button"
        class="dropdown-trigger"
        :class="{ open: isOpen }"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        @click="toggleDropdown"
      >
        <span class="dropdown-text">{{ displayText }}</span>
        <base-icon
          class="dropdown-icon"
          :class="{ rotated: isOpen }"
          :path="chevronDownIconPath"
          width="16px"
          height="16px"
        />
      </button>
      <div v-if="isOpen" class="dropdown-menu" role="listbox">
        <label
          v-for="option in options"
          :key="option.value"
          class="dropdown-option"
          :class="{ selected: isSelected(option.value) }"
        >
          <input
            type="checkbox"
            :checked="isSelected(option.value)"
            @change="toggleOption(option.value)"
          />
          <span class="checkmark"></span>
          <span>{{ option.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dropdown-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dropdown-label {
  color: var(--foreground-color-1);
  font-size: 0.75rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.dropdown-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.dropdown-trigger {
  display: flex;
  min-width: 180px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: linear-gradient(
    180deg,
    var(--background-color-2) 0%,
    var(--background-color-1) 100%
  );
  box-shadow: var(--shadow-sm);
  color: var(--foreground-color-0);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  gap: 8px;
  transition: var(--transition-base);
}

.dropdown-trigger:hover {
  border-color: var(--primary-color-transparent);
  background: linear-gradient(
    180deg,
    var(--background-color-3) 0%,
    var(--background-color-1) 100%
  );
}

.dropdown-trigger.open {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-glow) var(--primary-color-glow);
}

.dropdown-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  flex-shrink: 0;
  color: var(--foreground-color-1);
  transition: var(--transition-base);
}

.dropdown-trigger.open .dropdown-icon {
  color: var(--primary-color);
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  z-index: 100;
  top: calc(100% + 4px);
  right: 0;
  left: 0;
  overflow: auto;
  max-height: 180px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: var(--background-color-1);
  box-shadow: var(--shadow-lg);
}

.dropdown-option {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  padding: 10px 14px;
  color: var(--foreground-color-0);
  cursor: pointer;
  font-size: 0.9rem;
  gap: 10px;
  text-align: left;
  transition: var(--transition-fast);
  user-select: none;
}

.dropdown-option:hover {
  background: var(--background-color-2);
}

.dropdown-option.selected {
  background: var(--primary-color-transparent);
  color: var(--primary-color);
}

.dropdown-option input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.checkmark {
  display: flex;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-sm);
  background: var(--background-color-0);
  transition: var(--transition-fast);
}

.checkmark::after {
  width: 5px;
  height: 9px;
  border: solid transparent;
  border-width: 0 2px 2px 0;
  content: "";
  transform: rotate(45deg) translateY(-1px);
  transition: var(--transition-fast);
}

.dropdown-option.selected .checkmark {
  border-color: var(--primary-color);
  background: var(--primary-color);
}

.dropdown-option.selected .checkmark::after {
  border-color: var(--background-color-0);
}

@media (width <= 768px) {
  .dropdown-trigger {
    min-height: 44px;
    padding: 10px 12px;
    font-size: 0.85rem;
  }

  .dropdown-option {
    min-height: 44px;
    padding: 10px 12px;
    font-size: 0.85rem;
  }
}

@media (width <= 480px) {
  .dropdown-trigger {
    padding: 8px 10px;
    font-size: 0.8rem;
  }

  .dropdown-option {
    padding: 8px 10px;
    font-size: 0.8rem;
  }
}
</style>
