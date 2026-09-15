<script setup lang="ts">
import {
  BaseButton,
  LeechFlagButton,
  QuizSummary,
  RadicalView,
} from "../components";
import { useQuizSummary } from "../composables";
import type { Radical, ReviewSubject } from "../types";
import { getRadicalImageUrl } from "../utils";

const {
  quizReport,
  incorrectItems,
  newDeckName,
  shouldShowNameInput,
  sourceDeck,
  hasIncorrectItems,
  hasQuizReport,
  showNameInput,
  hideNameInput,
  handleDismiss,
  handleCreateDeck,
  handleUpdateDeck,
} = useQuizSummary();

const getCharacters = (item: ReviewSubject) => item.data.characters;

const getRadicalUrl = (item: ReviewSubject) => {
  if (item.object === "radical") {
    return getRadicalImageUrl((item.data as Radical).character_images);
  }

  return undefined;
};
</script>

<template>
  <div v-if="hasQuizReport" class="quiz-summary-page">
    <header>
      <h1 class="page-title">Quiz Complete</h1>
    </header>
    <section class="statistics-section">
      <h2 class="section-title">Statistics</h2>
      <quiz-summary :quiz-report="quizReport" />
    </section>
    <section v-if="incorrectItems.length > 0" class="incorrect-section">
      <h2 class="section-title">
        Incorrect Answers ({{ incorrectItems.length }})
      </h2>
      <p class="section-hint">Flag the ones you keep missing as leeches.</p>
      <ul class="incorrect-list" role="list">
        <li
          v-for="item in incorrectItems"
          :key="item.id"
          class="incorrect-item"
          :class="item.object"
        >
          <radical-view
            v-if="item.object === 'radical'"
            :characters="getCharacters(item)"
            :url="getRadicalUrl(item)"
            size="1.5rem"
          />
          <span v-else class="item-characters">{{ getCharacters(item) }}</span>
          <span class="item-type">{{ item.object }}</span>
          <leech-flag-button
            :subject-id="item.id"
            :label="getCharacters(item) || 'radical'"
          />
        </li>
      </ul>
    </section>
    <section v-if="hasIncorrectItems" class="deck-section">
      <h2 class="section-title">Save Incorrect Items</h2>
      <p v-if="sourceDeck" class="deck-info">
        Your quiz was based on the deck "{{ sourceDeck.name }}". What would you
        like to do with the incorrect items?
      </p>
      <p v-else class="deck-info">
        Would you like to save the incorrect items as a new deck for future
        review?
      </p>
      <div class="deck-actions">
        <base-button v-if="sourceDeck" @click="handleUpdateDeck">
          Update "{{ sourceDeck.name }}"
        </base-button>
        <div v-if="!shouldShowNameInput" class="create-deck-trigger">
          <base-button @click="showNameInput">Create New Deck</base-button>
        </div>
        <div v-else class="create-deck-form">
          <input
            v-model="newDeckName"
            class="deck-input"
            placeholder="New deck name..."
            aria-label="New deck name"
            @keyup.enter="handleCreateDeck"
          />
          <base-button
            size="small"
            :disabled="!newDeckName.trim()"
            @click="handleCreateDeck"
          >
            Save
          </base-button>
          <base-button size="small" @click="hideNameInput">
            Cancel
          </base-button>
        </div>
        <base-button @click="handleDismiss">Dismiss</base-button>
      </div>
    </section>
    <footer v-if="!hasIncorrectItems" class="page-footer">
      <base-button @click="handleDismiss">Return to Dashboard</base-button>
    </footer>
  </div>
</template>

<style scoped>
.quiz-summary-page {
  display: flex;
  max-width: 800px;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  margin: 0 auto;
  gap: 32px;
}

.page-title {
  margin: 0;
  color: var(--foreground-color-0);
  font-size: 2rem;
  font-weight: 700;
}

.section-title {
  margin: 0 0 16px;
  color: var(--foreground-color-1);
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
}

.statistics-section,
.incorrect-section,
.deck-section {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.incorrect-list {
  display: flex;
  max-width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  margin: 0;
  gap: 12px;
  list-style: none;
}

.incorrect-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  gap: 4px;
}

.incorrect-item.radical {
  border: 1px solid var(--radical-color);
  background: linear-gradient(
    180deg,
    var(--radical-color-transparent) 0%,
    transparent 100%
  );
}

.incorrect-item.kanji {
  border: 1px solid var(--kanji-color);
  background: linear-gradient(
    180deg,
    var(--kanji-color-transparent) 0%,
    transparent 100%
  );
}

.incorrect-item.vocabulary {
  border: 1px solid var(--vocabulary-color);
  background: linear-gradient(
    180deg,
    var(--vocabulary-color-transparent) 0%,
    transparent 100%
  );
}

.item-characters {
  font-size: 1.5rem;
}

.item-type {
  color: var(--dimmed-color);
  font-size: 0.75rem;
  text-transform: capitalize;
}

.section-hint {
  margin: -8px 0 12px;
  color: var(--dimmed-color);
  font-size: 0.8rem;
  text-align: center;
}

.deck-section {
  padding: 24px;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-lg);
  background: var(--background-color-1);
}

.deck-info {
  margin: 0 0 20px;
  color: var(--foreground-color-1);
  font-size: 0.95rem;
  text-align: center;
}

.deck-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.create-deck-form {
  display: flex;
  align-items: center;
  gap: 8px;
}

.deck-input {
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-md);
  background: var(--background-color-0);
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

.page-footer {
  padding-top: 16px;
}

@media (width <= 768px) {
  .quiz-summary-page {
    padding: 24px 16px;
    gap: 24px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .incorrect-list {
    gap: 8px;
  }

  .incorrect-item {
    padding: 10px 12px;
  }

  .item-characters {
    font-size: 1.25rem;
  }

  .deck-section {
    padding: 16px;
  }

  .deck-actions {
    width: 100%;
    flex-direction: column;
  }

  .deck-actions > :deep(.button),
  .create-deck-trigger :deep(.button) {
    width: 100%;
    justify-content: center;
  }

  .create-deck-trigger {
    width: 100%;
  }

  .create-deck-form {
    width: 100%;
    flex-direction: column;
  }

  .deck-input {
    width: 100%;
  }
}

@media (width <= 480px) {
  .quiz-summary-page {
    padding: 16px 12px;
  }

  .page-title {
    font-size: 1.3rem;
  }

  .item-characters {
    font-size: 1.1rem;
  }

  .incorrect-item {
    padding: 8px 10px;
  }
}
</style>
