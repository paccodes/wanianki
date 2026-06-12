<script setup lang="ts">
import { ref } from "vue";

import {
  ApiKeyDialog,
  BaseButton,
  BaseHeader,
  BaseIcon,
  BaseSpinner,
  BaseSwitch,
  DeckDialog,
  SubjectSelector,
} from "../components";
import {
  useDashboard,
  useDecks,
  user,
  useRefreshData,
  useTheme,
} from "../composables";
import {
  bookIconPath,
  cardsStackIconPath,
  darkModeIconPath,
  lightIconPath,
  syncIconPath,
} from "../icon-paths";

const { theme, toggleTheme } = useTheme();

const { isRefreshing, refresh } = useRefreshData();

const { decks, saveDeck, removeDeck } = useDecks();

const {
  level,
  selectedSubjectIds,
  selectedSubjects,
  shouldShuffle,
  isQuizMode,
  isLoading,
  canReview,
  handleLoadDeck,
  handleSaveDeck,
  handleAddSubjectId,
  handleDeleteSubjectId,
  handleClearSubjectIds,
  handleStartReview,
} = useDashboard(saveDeck);

const deckDialogRef = ref<InstanceType<typeof DeckDialog> | null>(null);
const apiKeyDialogRef = ref<InstanceType<typeof ApiKeyDialog> | null>(null);

const openDeckDialog = () => {
  deckDialogRef.value?.dialogRef?.showModal();
};

const openApiKeyDialog = () => {
  apiKeyDialogRef.value?.dialogRef?.showModal();
};

const handleRefreshSubmit = (apiKey: string) => {
  refresh(apiKey);
};
</script>

<template>
  <div v-if="isLoading" class="loading-page">
    <base-spinner width="96px" height="96px" />
  </div>
  <div v-else class="dashboard-page">
    <base-header>
      <p class="text">
        <span class="user-info">
          Logged in as <b>{{ user?.username }}</b> (level {{ user?.level }})
        </span>
        <span class="header-actions">
          <span class="separator">·&nbsp;</span>
          <button
            class="theme-toggle"
            :title="
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            "
            @click="toggleTheme"
          >
            <base-icon
              :path="theme === 'dark' ? lightIconPath : darkModeIconPath"
              width="24px"
              height="24px"
            />
          </button>
          <button
            class="decks-toggle"
            title="Manage saved decks"
            @click="openDeckDialog"
          >
            <base-icon :path="cardsStackIconPath" width="24px" height="24px" />
          </button>
          <button
            class="refresh-button"
            :class="{ refreshing: isRefreshing }"
            title="Check for level changes"
            :disabled="isRefreshing"
            @click="openApiKeyDialog"
          >
            <base-icon :path="syncIconPath" width="24px" height="24px" />
          </button>
          <a
            class="github-link"
            href="https://github.com/paccodes/wanianki"
            target="_blank"
            rel="noopener noreferrer"
            title="View source"
          >
            <svg viewBox="0 0 24 24" class="github-icon">
              <path
                fill="currentColor"
                d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"
              />
            </svg>
          </a>
        </span>
      </p>
    </base-header>
    <div class="subject-selection-section">
      <subject-selector
        :level="level!"
        :selected-subject-ids="selectedSubjectIds"
        :selected-subjects="selectedSubjects"
        @add="handleAddSubjectId"
        @delete="handleDeleteSubjectId"
        @clear="handleClearSubjectIds"
      />
    </div>
    <div class="control-section section">
      <base-switch
        v-model="shouldShuffle"
        off-label="Ordered"
        on-label="Shuffled"
      />
      <base-button
        title="Start a fresh review session"
        :left-icon-path="bookIconPath"
        :disabled="!canReview"
        @click="handleStartReview"
      >
        Start review
      </base-button>
      <base-switch
        v-model="isQuizMode"
        off-label="Study mode"
        on-label="Quiz mode"
      />
    </div>
  </div>
  <deck-dialog
    ref="deckDialogRef"
    :decks="decks"
    :has-selection="canReview"
    @save="handleSaveDeck"
    @load="handleLoadDeck"
    @remove="removeDeck"
  />
  <api-key-dialog ref="apiKeyDialogRef" @submit="handleRefreshSubmit" />
</template>

<style scoped>
.loading-page {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.dashboard-page {
  display: grid;
  width: 100%;
  height: 100%;
  gap: 16px;
  grid-template:
    "header header header" auto
    "subject-selection subject-selection subject-selection" 1fr
    "control control control" auto / 1fr 1fr 1fr;
}

.section {
  padding: 16px 20px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: linear-gradient(
    180deg,
    var(--background-color-1) 0%,
    var(--background-color-transparent) 100%
  );
  box-shadow: var(--shadow-md);
}

.text {
  margin: 0;
  color: var(--foreground-color-1);
  font-size: 0.9rem;
  text-align: center;
}

.text b {
  color: var(--primary-color);
}

.separator {
  color: var(--foreground-color-2);
  margin-inline: 8px;
}

.refresh-button {
  display: inline-flex;
  border: none;
  margin-right: 16px;
  background: transparent;
  color: var(--foreground-color-1);
  cursor: pointer;
  transition: var(--transition-base);
  vertical-align: middle;
}

.refresh-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.refresh-button:hover:not(:disabled) {
  color: var(--primary-color);
}

.refresh-button.refreshing :deep(svg) {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.theme-toggle {
  display: inline-flex;
  border: none;
  margin-right: 12px;
  background: transparent;
  color: var(--foreground-color-1);
  cursor: pointer;
  transition: var(--transition-base);
  vertical-align: middle;
}

.theme-toggle:hover {
  color: var(--primary-color);
}

.decks-toggle {
  display: inline-flex;
  border: none;
  margin-right: 12px;
  background: transparent;
  color: var(--foreground-color-1);
  cursor: pointer;
  transition: var(--transition-base);
  vertical-align: middle;
}

.decks-toggle:hover {
  color: var(--primary-color);
}

.github-link {
  display: inline-flex;
  color: var(--foreground-color-1);
  text-decoration: none;
  transition: var(--transition-base);
  vertical-align: middle;
}

.github-link:hover {
  color: var(--primary-color);
}

.github-icon {
  position: relative;
  bottom: 1px;
  width: 24px;
  height: 24px;
}

.subject-selection-section {
  overflow: hidden;
  grid-area: subject-selection;
}

.control-section {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  grid-area: control;
  padding-block: 12px;
}

.kanji {
  border: 1px solid var(--kanji-color);
  background-color: var(--kanji-color-transparent);
}

.radical {
  border: 1px solid var(--radical-color);
  background-color: var(--radical-color-transparent);
}

.vocabulary {
  border: 1px solid var(--vocabulary-color);
  background-color: var(--vocabulary-color-transparent);
}

@media (width <= 992px) {
  .text {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .user-info {
    width: 100%;
  }

  .header-actions {
    margin-top: 8px;
  }

  .separator {
    display: none;
  }
}

@media (width <= 768px) {
  .dashboard-page {
    padding: 12px;
    gap: 12px;
    grid-template:
      "header" auto
      "subject-selection" 1fr
      "control" auto / 1fr;
  }

  .control-section {
    display: grid;
    padding: 16px;
    gap: 12px;
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .control-section > :first-child {
    order: 2;
  }

  .control-section > :nth-child(2) {
    order: 3;
  }

  .control-section > :last-child {
    order: 1;
  }

  .text {
    font-size: 0.85rem;
  }
}

@media (width <= 480px) {
  .dashboard-page {
    min-height: 920px;
    padding: 8px;
    gap: 8px;
  }

  .section {
    padding: 12px 16px;
  }

  .separator {
    margin-inline: 4px;
  }

  .refresh-button {
    margin-right: 6px;
  }

  .theme-toggle {
    margin-right: 6px;
  }

  .decks-toggle {
    margin-right: 10px;
  }

  .control-section {
    padding: 12px;
  }
}
</style>
