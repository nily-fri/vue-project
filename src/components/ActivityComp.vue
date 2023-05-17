<template>
  <div>
    <SearchBar @search="searchActivities" :suggestions="resourceTypeSuggestions" />
    <ul>
      <li v-for="activity in filteredActivities" :key="activity.id" data-test="activity">
        <strong> {{ activity.topic_data.name }} {{ activity.resource_type }} </strong>
        {{ formatDate(activity.d_created) }}
        <span
          v-if="
            activity.resource_type == 'quiz' ||
              activity.resource_type == 'easy_quiz' ||
              activity.resource_type == 'challenge'
          "
          style="color: blue;"
        >
          score {{ activity.score }}/10
        </span>

        <button
          v-if="
            activity.resource_type === 'quiz' ||
              activity.resource_type === 'easy_quiz' ||
              activity.resource_type === 'challenge' ||
              activity.resource_type === 'make_a_map' ||
              activity.resource_type === 'word_play' ||
              activity.resource_type === 'draw_about_it'
          "
          @click="TogglePopup(activity.id)"
        >
          view work
        </button>

        <ViewWorkComp
          v-if="popupTriggers[activity.id]"
          :TogglePopup="() => TogglePopup(activity.id)"
          :activity="activity"
        >
          {{ activity.topic_data.name }}
          {{ activity.resource_type }}
          {{ formatDate(activity.d_created) }}
          {{ activity.comment }}
          <span
            v-if="
              activity.resource_type == 'quiz' ||
                activity.resource_type == 'easy_quiz' ||
                activity.resource_type == 'challenge'
            "
            >score {{ activity.score }}/10</span
          >
        </ViewWorkComp>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import SearchBar from "./SearchBar.vue";

import ViewWorkComp from "./ViewWorkComp.vue";

export default {
  name: "ActivityComp",
  created() {
    this.getActivities();
  },
  data() {
    return {
      activities: null,
      popupTriggers: {},
        searchQuery: "",
            resourceTypeSuggestions: []

    };
  },
  methods: {
    getActivities() {
      axios.get("http://localhost:3000/activities/v1").then(response => {
        this.activities = response.data;
        this.activities.forEach(activity => {
          this.$set(this.popupTriggers, activity.id, false);
        });
        this.resourceTypeSuggestions = this.activities.map(activity => activity.resource_type);
      });
    },
   
    TogglePopup(activityId) {
      this.popupTriggers[activityId] = !this.popupTriggers[activityId];
    },
    formatDate(timestamp) {
      const date = new Date(timestamp * 1000);
      const options = {
        month: "short",
        day: "2-digit",
        year: "numeric"
      };
      const options2 = {
        hour: "numeric",
        minute: "numeric"
      };
      return `${date.toLocaleString("en-US", options)} • ${date.toLocaleString("en-US", options2)}`;
    },
    searchActivities(query) {
      this.searchQuery = query;
    }
  },
  computed: {
    filteredActivities() {
      if (!this.searchQuery) {
        return this.activities;
      }
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      return this.activities.filter(activity =>
        activity.resource_type.toLowerCase().includes(lowerCaseQuery)
      );
    }
  },

  components: { ViewWorkComp, SearchBar }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
  display: grid;
}
li {
  display: inline-block;
  margin: 0 10px;
  border: 1px solid;
  padding: 15px;
  margin: 5px;
}
</style>
