import { createRouter, createWebHistory } from "vue-router";
import Listing from "../views/Listing.vue";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/listing",
    name: "Listing",
    component: Listing,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    // meta: {
    //   hideForAuth: true,
    // },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      hideForAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Check if Authorized before routes
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("token")) {
      next();
    } else {
      next({ name: "Login" });
    }
  } else if (to.matched.some((record) => record.meta.hideForAuth)) {
    if (localStorage.getItem("token")) {
      next({ path: "/listing" });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
