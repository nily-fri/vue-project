import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import viewWork from "../components/ViewWorkComp.vue";
import advanced from "../components/AdvancedActivities.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/view-work",
    name: "viewWork",
    component: viewWork
  },
  {
    path: "/advanced",
    name: "advanced",
    component: advanced
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
