<script setup lang="ts">
import { BaseIcon } from "../components";
import { useLogin } from "../composables";
import { loginIconPath } from "../icon-paths";
import { getTagline } from "../utils";

const { inputValue, isLoading, onSubmit } = useLogin();

const tagline = getTagline();
</script>

<template>
  <div className="login-page">
    <div className="header-container">
      <h1 className="title">WaniAnki</h1>
      <h2 className="tagline">{{ tagline }}</h2>
    </div>
    <div className="form-container">
      <div className="form">
        <input
          v-model="inputValue"
          autofocus
          class="input"
          placeholder="Enter you WaniKani API key"
          type="password"
          :disabled="isLoading"
          @keyup.enter="onSubmit"
        />
        <button
          class="button"
          type="button"
          :disabled="isLoading || !inputValue?.length"
          @click="onSubmit"
        >
          Authenticate
          <base-icon width="32px" height="32px" :path="loginIconPath" />
        </button>
      </div>
    </div>
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
  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  display: grid;
  height: 100%;
  grid-template-areas:
    "titles"
    "form";
  grid-template-rows: 2fr 1fr;
}

.github-link {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  display: inline-flex;
  color: var(--foreground-color-1);
  text-decoration: none;
  transform: translateX(-50%);
  transition: var(--transition-base);
}

.github-link:hover {
  color: var(--primary-color);
}

.github-icon {
  width: 32px;
  height: 32px;
}

.header-container {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-area: titles;
}

.title {
  animation: gradient-shift 8s ease infinite;
  background-clip: text;
  background-image: linear-gradient(
    90deg,
    var(--vocabulary-color),
    var(--kanji-color),
    var(--radical-color) 80%
  );
  background-size: 100%;
  font-size: 7rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-block: 0;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  text-shadow: 0 0 60px var(--vocabulary-color-glow);
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.tagline {
  margin-top: 0.5rem;
  color: var(--foreground-color-1);
  font-size: 1.4rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  opacity: 0.85;
}

.form-container {
  display: flex;
  justify-content: center;
  grid-area: form;
}

.form {
  display: flex;
  overflow: hidden;
  width: min(50vw, 600px);
  height: 3.4rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}

.form:hover {
  box-shadow:
    var(--shadow-lg),
    var(--shadow-glow) var(--primary-color-glow);
}

.input {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 1.2rem;
  border: 1px solid var(--background-color-3);
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  border-right: none;
  background: linear-gradient(
    180deg,
    var(--background-color-2) 0%,
    var(--background-color-1) 100%
  );
  color: var(--foreground-color-0);
  font-size: 1rem;
  transition: var(--transition-base);
}

.input::placeholder {
  color: var(--muted-color);
}

.button {
  display: flex;
  height: 100%;
  flex-shrink: 0;
  align-items: center;
  padding: 0 1.4rem;
  border: 1px solid var(--primary-color);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  background-color: var(--primary-color);
  color: var(--on-primary-color);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  gap: 10px;
  letter-spacing: 0.02em;
  transition: var(--transition-base);
}

.input:disabled,
.button:disabled {
  background: var(--background-color-2);
  color: var(--muted-color);
  cursor: not-allowed;
  opacity: 0.6;
}

.button:disabled {
  border-color: var(--background-color-3);
}

.button:hover:not(:disabled) {
  filter: brightness(1.1);
  transform: translateX(2px);
}

.button:active:not(:disabled) {
  transform: translateX(0);
}

.form:has(.input:focus) {
  box-shadow:
    var(--shadow-lg),
    var(--shadow-glow) var(--primary-color-glow);
}

.form:has(.input:focus) .input {
  border-color: var(--primary-color);
}

@media (width <= 768px) {
  .login-page {
    padding: 24px;
  }

  .title {
    font-size: clamp(3rem, 12vw, 5rem);
  }

  .tagline {
    font-size: 1rem;
    text-align: center;
  }

  .form-container {
    align-items: center;
  }

  .form {
    width: 100%;
    max-width: 500px;
    height: auto;
    flex-direction: column;
  }

  .input {
    height: 3.2rem;
    border-radius: var(--radius-lg);
    border-right: 1px solid var(--background-color-3);
    border-bottom: none;
    text-align: center;
  }

  .button {
    height: 3.2rem;
    justify-content: center;
    border-radius: var(--radius-lg);
  }
}

@media (width <= 480px) {
  .login-page {
    padding: 16px;
  }

  .title {
    font-size: clamp(2.5rem, 15vw, 3.5rem);
  }

  .tagline {
    font-size: 0.9rem;
    padding-inline: 16px;
  }
}
</style>
