import { createRouter, createWebHistory } from "vue-router";
import Loginpage from "../views/Login.vue";
import Home from "../views/Home.vue";
import Chatadmin from "../views/ChatAdmin.vue";
import QA from "../views/QaAdmin.vue";
import QAedit from "../views/QAedit.vue";
import Deletepage from "../views/Deletepage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      meta: { title: "login page" },
      component: Loginpage,
    },
    {
      path: "/home",
      name: "home",
      meta: { title: "home page" },
      component: Home,
    },
    {
      path: "/management",
      name: "chatAdmin",
      meta: { title: "chat admin" },
      component: Chatadmin,
    },
    {
      path: "/qamanagement",
      name: "QA",
      meta: { title: "QA" },
      component: QA,
    },
    {
      path: "/qaupdate",
      name: "update",
      meta: { title: "update QA" },
      component: QAedit,
    },
    {
      path: "/qadelete",
      name: "delete",
      meta: { title: "delete QA" },
      component: Deletepage,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // console.log(to);
  document.title = to.meta.title;
  next();
});

export default router;
