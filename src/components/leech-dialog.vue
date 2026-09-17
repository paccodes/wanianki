<script setup lang="ts">
import { computed, ref } from "vue";

import { LEECH_SOURCES, useLeeches } from "../composables";
import {
  differenceIconPath,
  flagIconPath,
  inventoryIconPath,
  queryStatsIconPath,
  syncIconPath,
} from "../icon-paths";
import type { Leech, LeechSource } from "../types";
import { getPluralizedQuantity } from "../utils";

import BaseButton from "./base-button.vue";
import BaseDialog from "./base-dialog.vue";
import BaseIcon from "./base-icon.vue";
import BaseSpinner from "./base-spinner.vue";
import BaseSwitch from "./base-switch.vue";
import LeechFlagButton from "./leech-flag-button.vue";
import SubjectView from "./subject-view.vue";

const MAX_VISIBLE_LEECHES = 100;

interface SourceInfo {
  label: string;
  icon: string;
  description: string;
}

const sourceInfo: Record<LeechSource, SourceInfo> = {
  statistical: {
    label: "Statistical",
    icon: queryStatsIconPath,
    description:
      "Chronic failures computed from your WaniKani review statistics",
  },
  manual: {
    label: "Manual",
    icon: flagIconPath,
    description: "Items you flagged yourself",
  },
  confusion: {
    label: "Confusion",
    icon: differenceIconPath,
    description:
      "Seeded from the kanji you keep missing or flagged, each paired with the look-alikes you have unlocked or already miss",
  },
  curated: {
    label: "Curated",
    icon: inventoryIconPath,
    description:
      "Bundled lists of commonly confused items shipped with WaniAnki",
  },
};

const emit = defineEmits<{
  drill: [subjectIds: number[]];
  sync: [];
}>();

const {
  leeches,
  countsBySource,
  countsByCuratedList,
  countsByCuratedScope,
  curatedLists,
  curatedScope,
  isLoading,
  lastSyncedAt,
  isSourceEnabled,
  toggleSource,
  isCuratedListEnabled,
  toggleCuratedList,
} = useLeeches();

const baseDialogRef = ref<InstanceType<typeof BaseDialog> | null>(null);

const isEverythingScope = computed<boolean>({
  get: () => curatedScope.value === "all",
  set: (value) => {
    curatedScope.value = value ? "all" : "struggling";
  },
});

const visibleLeeches = computed<Leech[]>(() =>
  leeches.value.slice(0, MAX_VISIBLE_LEECHES),
);

const hiddenCount = computed<number>(
  () => leeches.value.length - visibleLeeches.value.length,
);

const lastSyncedLabel = computed<string>(() =>
  lastSyncedAt.value === null
    ? "never synced"
    : `last synced ${new Date(lastSyncedAt.value).toLocaleDateString()}`,
);

const isAnyCuratedListEnabled = computed<boolean>(() =>
  curatedLists.some(({ id }) => isCuratedListEnabled(id)),
);

const curatedNotice = computed<string>(() => {
  if (!isAnyCuratedListEnabled.value) {
    return "No list is selected, so the curated source adds nothing.";
  }

  if (
    curatedScope.value !== "struggling" ||
    countsByCuratedScope.value.struggling > 0
  ) {
    return "";
  }

  return lastSyncedAt.value === null
    ? "Struggling only matches these groups against the items you miss, and your review statistics have never been synced — so there is nothing to match against yet. Sync them, or pick Everything."
    : "None of the selected groups holds an item you are currently missing. Pick Everything to drill them anyway.";
});

const getSourceTitle = (source: LeechSource): string =>
  `${sourceInfo[source].label}: ${sourceInfo[source].description.toLowerCase()}`;

const getScoreTitle = (score: number): string =>
  `Leech score ${score.toFixed(1)}: wrong answers weighed against your current streak. The higher it is, the more this item keeps tripping you up.`;

const handleOpen = () => {
  baseDialogRef.value?.open();
};

const handleClose = () => {
  baseDialogRef.value?.close();
};

const handleDrill = () => {
  emit(
    "drill",
    leeches.value.map(({ subjectId }) => subjectId),
  );

  handleClose();
};

const handleSync = () => {
  handleClose();

  emit("sync");
};

defineExpose({
  open: handleOpen,
  close: handleClose,
});
</script>

<template>
  <base-dialog
    ref="baseDialogRef"
    title="Leeches"
    width="min(960px, 100vw - 96px)"
  >
    <p class="dialog-description">
      Items you keep missing, pooled from every enabled source. Drill them as a
      one-off deck.
    </p>
    <div class="sources" role="group" aria-label="Leech sources">
      <button
        v-for="source in LEECH_SOURCES"
        :key="source"
        type="button"
        class="source"
        :class="{ active: isSourceEnabled(source) }"
        :aria-pressed="isSourceEnabled(source)"
        :title="sourceInfo[source].description"
        @click="toggleSource(source)"
      >
        <base-icon :path="sourceInfo[source].icon" width="16px" height="16px" />
        {{ sourceInfo[source].label }}
        <span class="source-count">{{ countsBySource[source] }}</span>
      </button>
    </div>
    <div v-if="isSourceEnabled('curated')" class="curated-panel">
      <base-switch
        v-model="isEverythingScope"
        :off-label="`Struggling only (${countsByCuratedScope.struggling})`"
        :on-label="`Everything (${countsByCuratedScope.all})`"
      />
      <div class="chips" role="group" aria-label="Curated leech lists">
        <button
          v-for="list in curatedLists"
          :key="list.id"
          type="button"
          class="chip"
          :class="{ active: isCuratedListEnabled(list.id) }"
          :aria-pressed="isCuratedListEnabled(list.id)"
          :title="list.description"
          @click="toggleCuratedList(list.id)"
        >
          {{ list.name }}
          <span class="chip-count">{{ countsByCuratedList[list.id] }}</span>
        </button>
      </div>
      <p v-if="curatedNotice" class="curated-notice">{{ curatedNotice }}</p>
      <p class="curated-hint">
        Struggling only keeps the groups holding an item you already miss;
        Everything keeps every group of the selected lists. A group only ever
        holds subjects you have unlocked or already miss.
      </p>
    </div>
    <p class="summary">
      <strong>{{ getPluralizedQuantity("leech", leeches.length) }}</strong>
      from the enabled sources.
    </p>
    <ul v-if="visibleLeeches.length > 0" class="leech-list" role="list">
      <li
        v-for="leech in visibleLeeches"
        :key="leech.subjectId"
        class="leech-item"
      >
        <span class="glyph" :class="leech.subject.object">
          <subject-view
            :subject="leech.subject"
            primary-size="20px"
            secondary-size="1.1rem"
          />
        </span>
        <span class="details">
          <span class="source-badges">
            <span
              v-for="source in leech.sources"
              :key="source"
              class="source-badge"
              :title="getSourceTitle(source)"
              :aria-label="sourceInfo[source].label"
            >
              <base-icon
                :path="sourceInfo[source].icon"
                width="14px"
                height="14px"
              />
            </span>
          </span>
          <span class="level">Lv. {{ leech.subject.data.level }}</span>
        </span>
        <span
          v-if="leech.score > 0"
          class="score"
          :title="getScoreTitle(leech.score)"
        >
          {{ leech.score.toFixed(1) }}
        </span>
        <leech-flag-button
          :subject-id="leech.subjectId"
          :label="leech.subject.data.characters || 'radical'"
          size="18px"
        />
      </li>
    </ul>
    <p v-else class="empty-message">
      No leeches yet. Sync your review statistics or flag items you keep
      missing.
    </p>
    <p v-if="hiddenCount > 0" class="hidden-count">
      and {{ getPluralizedQuantity("more item", hiddenCount) }} not listed here.
    </p>
    <p class="sync-info">
      Statistical leeches come from your WaniKani review statistics ({{
        lastSyncedLabel
      }}).
    </p>
    <template #footer>
      <base-spinner v-if="isLoading" width="24px" height="24px" />
      <base-button
        :left-icon-path="syncIconPath"
        :disabled="isLoading"
        @click="handleSync"
      >
        Sync
      </base-button>
      <base-button :disabled="leeches.length === 0" @click="handleDrill">
        Drill leeches
      </base-button>
      <base-button @click="handleClose">Close</base-button>
    </template>
  </base-dialog>
</template>

<style scoped>
.dialog-description {
  margin: 0 0 16px;
  color: var(--foreground-color-1);
  font-size: 0.95rem;
}

.sources {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
  gap: 8px;
}

.curated-panel {
  display: flex;
  flex-direction: column;
  padding: 12px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  margin-bottom: 16px;
  background: var(--background-color-1);
  gap: 8px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.source,
.chip {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-full);
  background: var(--background-color-1);
  color: var(--muted-color);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.8rem;
  gap: 8px;
  transition: var(--transition-fast);
}

.chip {
  background: var(--background-color-2);
}

.source:hover,
.chip:hover {
  border-color: var(--primary-color);
}

.source.active,
.chip.active {
  border-color: var(--primary-color);
  background: linear-gradient(
    135deg,
    var(--primary-color-transparent) 0%,
    transparent 100%
  );
  color: var(--foreground-color-0);
}

.source-count,
.chip-count {
  color: var(--dimmed-color);
  font-size: 0.75rem;
}

.curated-notice {
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  margin: 0;
  background: var(--background-color-2);
  color: var(--foreground-color-1);
  font-size: 0.75rem;
  line-height: 1.5;
}

.curated-hint {
  margin: 0;
  color: var(--dimmed-color);
  font-size: 0.75rem;
}

.summary {
  margin: 0 0 12px;
  color: var(--foreground-color-1);
  font-size: 0.9rem;
}

.summary strong {
  color: var(--foreground-color-0);
}

.leech-list {
  display: grid;
  max-height: 320px;
  align-content: start;
  padding: 0;
  margin: 0;
  gap: 6px;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  list-style: none;
  overflow-y: auto;
}

.leech-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: var(--background-color-1);
  gap: 12px;
}

.glyph {
  display: flex;
  min-width: 2.25rem;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.glyph.radical {
  background: linear-gradient(
    135deg,
    var(--radical-color-transparent) 0%,
    transparent 100%
  );
}

.glyph.kanji {
  background: linear-gradient(
    135deg,
    var(--kanji-color-transparent) 0%,
    transparent 100%
  );
}

.glyph.vocabulary {
  background: linear-gradient(
    135deg,
    var(--vocabulary-color-transparent) 0%,
    transparent 100%
  );
}

.leech-item:hover .glyph.radical {
  border-color: var(--radical-color);
  box-shadow: var(--shadow-glow) var(--radical-color-glow);
}

.leech-item:hover .glyph.kanji {
  border-color: var(--kanji-color);
  box-shadow: var(--shadow-glow) var(--kanji-color-glow);
}

.leech-item:hover .glyph.vocabulary {
  border-color: var(--vocabulary-color);
  box-shadow: var(--shadow-glow) var(--vocabulary-color-glow);
}

.details {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
}

.source-badges {
  display: flex;
  align-items: center;
  gap: 4px;
}

.source-badge {
  display: flex;
  color: var(--foreground-color-1);
  cursor: help;
}

.level {
  display: flex;
  align-items: center;
  color: var(--dimmed-color);
  font-size: 0.75rem;
  gap: 8px;
}

.level::before {
  width: 1px;
  height: 12px;
  background: var(--background-color-3);
  content: "";
}

.score {
  color: var(--primary-color);
  cursor: help;
  font-size: 0.75rem;
}

.empty-message {
  margin: 0;
  color: var(--muted-color);
  font-size: 0.95rem;
  text-align: center;
}

.hidden-count,
.sync-info {
  margin: 12px 0 0;
  color: var(--dimmed-color);
  font-size: 0.75rem;
}

@media (width <= 768px) {
  .leech-list {
    max-height: 220px;
  }

  .leech-item {
    padding: 6px 10px;
    gap: 8px;
  }
}
</style>
