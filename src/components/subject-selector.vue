<script setup lang="ts">
import { computed, toRef } from "vue";

import { useSubjectSelection } from "../composables";
import type { ReviewSubject, SrsStageFilter, SubjectType } from "../types";
import { capitalize, getPluralizedQuantity } from "../utils";

import BaseButton from "./base-button.vue";
import BaseDropdown, { type DropdownOption } from "./base-dropdown.vue";
import SubjectCard from "./subject-card.vue";
import SubjectChip from "./subject-chip.vue";
import SubjectSuggestion from "./subject-suggestion.vue";

const srsStageOptions: DropdownOption<SrsStageFilter>[] = [
  { value: "locked", label: "Locked" },
  { value: "apprentice1", label: "Apprentice 1" },
  { value: "apprentice2", label: "Apprentice 2" },
  { value: "apprentice3", label: "Apprentice 3" },
  { value: "apprentice4", label: "Apprentice 4" },
  { value: "guru1", label: "Guru 1" },
  { value: "guru2", label: "Guru 2" },
  { value: "master", label: "Master" },
  { value: "enlightened", label: "Enlightened" },
  { value: "burned", label: "Burned" },
];

const props = defineProps<{
  level: number | undefined;
  selectedSubjectIds: Set<number>;
  selectedSubjects: ReviewSubject[];
}>();

const emit = defineEmits<{
  add: [id: number];
  delete: [id: number];
  clear: [];
}>();

const {
  searchQuery,
  isSearchOpen,
  highlightIndex,
  filters,
  filteredSubjectsByLevel,
  visibleLevels,
  firstOpenLevel,
  suggestions,
  setFilterType,
  addSubject,
  removeSubject,
  toggleSubject,
  clearSelection,
  toggleAllSubjectsInLevel,
  selectAllFilteredSubjects,
  setHighlightIndex,
  highlightPreviousSuggestion,
  highlightNextSuggestion,
  selectHighlightedSuggestion,
  showSuggestions,
  hideSuggestions,
} = useSubjectSelection({
  level: toRef(props, "level"),
  selectedSubjectIds: props.selectedSubjectIds,
  emit,
});

const levelSelectionButtonTextMap = computed<Record<number, string>>(() => {
  const result: Record<number, string> = {};

  for (const level of visibleLevels.value) {
    const allSelected = filteredSubjectsByLevel.value?.[level]?.every(
      ({ id }) => props.selectedSubjectIds.has(id),
    );

    result[level] = allSelected ? "Deselect all" : "Select all";
  }

  return result;
});
</script>

<template>
  <div class="review-selector">
    <div class="filters">
      <div class="tabs" role="tablist" aria-label="Filter by subject type">
        <button
          v-for="type in ['radical', 'kanji', 'vocabulary']"
          :key="type"
          role="tab"
          :aria-selected="filters.type === type"
          :class="`${type} ${filters.type === type ? 'active' : ''}`"
          class="tab"
          @click="setFilterType(type as SubjectType)"
        >
          {{ capitalize(type) }}
        </button>
      </div>
      <fieldset class="filter-group">
        <legend>Level range</legend>
        <div class="range">
          <input
            id="min-level"
            :key="`min-level-${level}`"
            v-model.number="filters.minLevel"
            type="range"
            min="1"
            :max="level"
            aria-label="Minimum level"
            :aria-valuemin="1"
            :aria-valuemax="level"
            :aria-valuenow="filters.minLevel"
          />
          <input
            id="max-level"
            :key="`max-level-${level}`"
            v-model.number="filters.maxLevel"
            type="range"
            min="1"
            :max="level"
            aria-label="Maximum level"
            :aria-valuemin="1"
            :aria-valuemax="level"
            :aria-valuenow="filters.maxLevel"
          />
          <span aria-live="polite">
            {{ filters.minLevel }}–{{ filters.maxLevel }}
          </span>
        </div>
      </fieldset>
      <base-dropdown
        v-model="filters.srsStages"
        :options="srsStageOptions"
        label="SRS stage"
        placeholder="All stages"
      />
      <div class="filter-group search">
        <input
          id="subject-search"
          v-model.trim="searchQuery"
          type="text"
          placeholder="Search by meaning or reading"
          role="combobox"
          aria-label="Search subjects by meaning or reading"
          aria-autocomplete="list"
          aria-controls="subject-suggestions"
          :aria-expanded="isSearchOpen && !!searchQuery"
          :aria-activedescendant="
            highlightIndex >= 0 ? `suggestion-${highlightIndex}` : undefined
          "
          @focus="showSuggestions"
          @blur="hideSuggestions"
          @keydown.up.prevent="highlightPreviousSuggestion"
          @keydown.down.prevent="highlightNextSuggestion"
          @keydown.enter.prevent="selectHighlightedSuggestion"
        />
        <div
          v-if="isSearchOpen && searchQuery"
          id="subject-suggestions"
          role="listbox"
          aria-label="Subject suggestions"
          class="suggestions"
          @mouseleave="setHighlightIndex(-1)"
        >
          <div
            v-for="(suggestion, index) in suggestions"
            :id="`suggestion-${index}`"
            :key="suggestion.id"
            role="option"
            :aria-selected="index === highlightIndex"
            :class="`${index === highlightIndex ? 'highlighted' : ''}`"
            class="suggestion"
            @mouseenter="setHighlightIndex(index)"
            @mousedown.prevent="addSubject(suggestion)"
          >
            <subject-suggestion
              :subject="suggestion"
              :primary-size="'20px'"
              :secondary-size="'20px'"
            />
          </div>
          <div v-if="suggestions.length === 0" class="no-suggestions">
            No matches
          </div>
        </div>
      </div>
      <base-button @click="selectAllFilteredSubjects">Select all</base-button>
      <base-button
        :disabled="selectedSubjectIds.size === 0"
        @click="clearSelection"
      >
        Clear selection
      </base-button>
    </div>
    <div class="levels">
      <details
        v-for="visibleLevel in visibleLevels"
        :key="visibleLevel"
        :open="visibleLevel === firstOpenLevel"
        class="level-section"
      >
        <summary class="level-header">
          <div>
            <span class="title">Level {{ visibleLevel }}</span>
            <span class="count">{{
              getPluralizedQuantity(
                "item",
                filteredSubjectsByLevel[visibleLevel]?.length || 0,
              )
            }}</span>
          </div>
          <base-button
            size="small"
            @click.stop="toggleAllSubjectsInLevel(visibleLevel)"
          >
            {{ levelSelectionButtonTextMap[visibleLevel] }}
          </base-button>
        </summary>
        <div
          class="grid"
          role="group"
          :aria-label="`Level ${visibleLevel} subjects`"
        >
          <button
            v-for="item in filteredSubjectsByLevel[visibleLevel]"
            :key="item.id"
            type="button"
            class="card"
            :class="{ selected: selectedSubjectIds.has(item.id) }"
            :aria-pressed="selectedSubjectIds.has(item.id)"
            :aria-label="`${item.data.characters || 'Radical'}, ${selectedSubjectIds.has(item.id) ? 'selected' : 'not selected'}`"
            @click="toggleSubject(item)"
          >
            <subject-card :subject="item" />
          </button>
        </div>
      </details>
    </div>
    <div class="selection-summary">
      <div class="summary-header">
        <strong>Selected:</strong>
        {{ getPluralizedQuantity("item", selectedSubjectIds.size) }}
      </div>
      <div class="chips" role="list" aria-label="Selected subjects">
        <button
          v-for="item in selectedSubjects"
          :key="item.id"
          type="button"
          class="chip"
          :aria-label="`Remove ${item.data.characters || 'radical'} from selection`"
          @click="removeSubject(item)"
        >
          <subject-chip :subject="item" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-selector {
  display: grid;
  width: 100%;
  height: 100%;
  gap: 16px;
  grid-template:
    "filters" auto
    "levels" 1fr
    "selection-summary" auto / 1fr;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 12px;
  grid-column: 1 / -1;
}

.tabs {
  display: inline-flex;
  gap: 2px;
}

.tab {
  padding: 0.5rem 1rem;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  border-bottom: none;
  background: var(--background-color-0);
  color: var(--muted-color);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 400;
  transition: var(--transition-fast);
}

.tab:hover:not(.active) {
  background: var(--background-color-2);
  color: var(--foreground-color-1);
}

.tab.radical {
  color: var(--radical-color);
}

.tab.kanji {
  color: var(--kanji-color);
}

.tab.vocabulary {
  color: var(--vocabulary-color);
}

.tab.active {
  position: relative;
  border-bottom: 1px solid transparent;
  color: var(--foreground-color-0);
}

.tab.radical.active {
  border-color: var(--radical-color);
  border-bottom-color: var(--background-color-1);
  background: linear-gradient(
    180deg,
    var(--radical-color-transparent) 0%,
    var(--background-color-1) 100%
  );
  box-shadow: var(--shadow-glow) var(--radical-color-glow);
}

.tab.kanji.active {
  border-color: var(--kanji-color);
  border-bottom-color: var(--background-color-1);
  background: linear-gradient(
    180deg,
    var(--kanji-color-transparent) 0%,
    var(--background-color-1) 100%
  );
  box-shadow: var(--shadow-glow) var(--kanji-color-glow);
}

.tab.vocabulary.active {
  border-color: var(--vocabulary-color);
  border-bottom-color: var(--background-color-1);
  background: linear-gradient(
    180deg,
    var(--vocabulary-color-transparent) 0%,
    var(--background-color-1) 100%
  );
  box-shadow: var(--shadow-glow) var(--vocabulary-color-glow);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  padding: 16px 20px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: linear-gradient(
    180deg,
    var(--background-color-1) 0%,
    var(--background-color-transparent) 100%
  );
  box-shadow: var(--shadow-md);
  gap: 16px;
  grid-area: filters;
}

.filter-group {
  display: flex;
  flex-direction: column;
  padding: 0;
  border: none;
  margin: 0;
  gap: 6px;
}

.filter-group legend {
  padding: 0;
  color: var(--foreground-color-1);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.range {
  display: flex;
  align-items: center;
  color: var(--foreground-color-0);
  gap: 8px;
}

.range span {
  min-width: 50px;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  background: var(--background-color-2);
  font-size: 0.85rem;
  text-align: center;
}

.range input {
  appearance: none;
  background-color: transparent;
  cursor: pointer;
}

.range ::-moz-range-track {
  height: 4px;
  border-radius: var(--radius-full);
  background: linear-gradient(
    90deg,
    var(--background-color-3) 0%,
    var(--foreground-color-1) 100%
  );
}

.range ::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--primary-color);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
}

.range ::-moz-range-thumb:hover {
  box-shadow: var(--shadow-glow) var(--primary-color-glow);
  transform: scale(1.2);
}

.range ::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: var(--radius-full);
  background: linear-gradient(
    90deg,
    var(--background-color-3) 0%,
    var(--foreground-color-1) 100%
  );
}

.range ::-webkit-slider-thumb {
  width: 14px;
  height: 14px;
  border: none;
  border-radius: var(--radius-full);
  margin-top: -5px;
  appearance: none;
  background: var(--primary-color);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
}

.range ::-webkit-slider-thumb:hover {
  box-shadow: var(--shadow-glow) var(--primary-color-glow);
  transform: scale(1.2);
}

.search {
  position: relative;
  min-width: 280px;
  flex: 1;
}

.search input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: var(--background-color-0);
  color: var(--foreground-color-0);
  font-size: 0.9rem;
  transition: var(--transition-base);
}

.search input::placeholder {
  color: var(--muted-color);
}

.search input:focus {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-glow) var(--primary-color-glow);
}

.suggestions {
  position: absolute;
  z-index: 10;
  top: calc(100% + 6px);
  right: 0;
  left: 0;
  overflow: auto;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: var(--background-color-1);
  box-shadow: var(--shadow-lg);
}

.suggestion {
  transition: var(--transition-fast);
}

.suggestion:nth-child(odd) {
  background: var(--background-color-0);
}

.suggestion.highlighted {
  background: var(--selection-color);
  color: var(--foreground-color-0);
}

.no-suggestions {
  padding: 12px 16px;
  color: var(--muted-color);
  font-size: 0.85rem;
}

.levels {
  display: flex;
  overflow: auto;
  flex-direction: column;
  padding: 16px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: linear-gradient(
    180deg,
    var(--background-color-1) 0%,
    var(--background-color-transparent) 100%
  );
  box-shadow: var(--shadow-md);
  gap: 10px;
  grid-area: levels;
  grid-column: 1 / 2;
}

.level-section {
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: var(--background-color-0);
  transition: var(--transition-base);
}

.level-section[open] {
  box-shadow: var(--shadow-sm);
}

.level-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.level-header:hover {
  border-radius: var(--radius-md);
  background: var(--background-color-2);
}

.level-header .title {
  font-size: 0.95rem;
  font-weight: 700;
}

.level-header .count {
  color: var(--muted-color);
  font-size: 0.8rem;
  padding-inline-start: 12px;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  padding: 0 16px 16px;
  gap: 10px;
}

.card {
  padding: 0;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  background: var(--background-color-1);
  color: inherit;
  cursor: pointer;
  font: inherit;
  transition: var(--transition-base);
}

.card:hover {
  border-color: var(--background-color-3);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card.selected {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-glow) var(--primary-color-glow);
}

.selection-summary {
  overflow: auto;
  max-height: 200px;
  padding: 16px 20px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: linear-gradient(
    180deg,
    var(--background-color-1) 0%,
    var(--background-color-transparent) 100%
  );
  box-shadow: var(--shadow-md);
  grid-area: selection-summary;
  grid-column: 1 / -1;
}

.summary-header {
  margin-bottom: 12px;
  color: var(--foreground-color-1);
  font-size: 0.9rem;
}

.summary-header strong {
  color: var(--foreground-color-0);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 0;
  border: none;
  border-radius: var(--radius-full);
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  transition: var(--transition-fast);
}

.chip:hover {
  transform: scale(1.05);
}

@media (width <= 768px) {
  .review-selector {
    gap: 12px;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
    padding: 12px;
    gap: 12px;
  }

  .tabs {
    width: 100%;
    justify-content: stretch;
  }

  .tab {
    flex: 1;
    justify-content: center;
    padding: 0.6rem 0.5rem;
    font-size: 0.85rem;
    text-align: center;
  }

  .filter-group {
    width: 100%;
  }

  .range {
    flex-wrap: wrap;
  }

  .range input {
    min-width: 80px;
    flex: 1;
  }

  .search {
    min-width: unset;
  }

  .suggestions {
    max-height: 300px;
  }

  .levels {
    padding: 12px;
  }

  .level-header {
    flex-wrap: wrap;
    padding: 10px 12px;
    gap: 8px;
  }

  .grid {
    justify-content: center;
    padding: 0 12px 12px;
    gap: 8px;
  }

  .selection-summary {
    max-height: 150px;
    padding: 12px;
  }

  .chips {
    gap: 6px;
  }
}

@media (width <= 480px) {
  .filters {
    padding: 10px;
    gap: 10px;
  }

  .tab {
    padding: 0.5rem 0.4rem;
    font-size: 0.8rem;
  }

  .level-header {
    padding: 8px 10px;
  }

  .level-header .title {
    font-size: 0.9rem;
  }

  .level-header .count {
    font-size: 0.75rem;
  }

  .grid {
    padding: 0 10px 10px;
    gap: 6px;
  }

  .selection-summary {
    max-height: 120px;
    padding: 10px;
  }
}
</style>
