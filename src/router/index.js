import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import viewWork from "../components/ViewWorkComp.vue"

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/view-work/:id",
    name: "viewWork",
    component: viewWork
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
