import "@fontsource/noto-sans-jp/400.css";
import "@fontsource/noto-sans-sc/400.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/400-italic.css";
import "@fontsource/roboto-mono/700.css";

import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import "./style.css";
import App from "./App.vue";
import { isCacheExpired } from "./cache";
import {
  useDataCleanup,
  useNotifications,
  useOpfsStorage,
  user,
} from "./composables";
import { routes } from "./routes";
import { USER_KEY } from "./storage-keys";
import type { User } from "./types";

const { addNotification } = useNotifications();
const { cleanUpData } = useDataCleanup();
const { getValue } = useOpfsStorage<User, "report">(USER_KEY);

const cachedUserData = await getValue();

if (cachedUserData) {
  if (!isCacheExpired(cachedUserData)) {
    user.value = cachedUserData.data;
  } else {
    await cleanUpData({
      onComplete: () => {
        addNotification(
          "Your cached data is outdated. Please log in to refresh your profile.",
          "warning",
        );
      },
    });
  }
}

const app = createApp(App);

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach((to) => {
  if (!user.value && to.path !== "/login") {
    return { path: "/login" };
  }
});

app.use(router);
app.mount("#app");
