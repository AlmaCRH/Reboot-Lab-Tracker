import { createRouter, createMemoryHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import TeacherView from "../views/TeacherView.vue";
import StudentView from "../views/StudentView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/teacher", component: TeacherView },
  { path: "/student", component: StudentView },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
