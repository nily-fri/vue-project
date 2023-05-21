<template>
  <div>
    <SearchBar
      @search="searchActivities"
      :suggestions="resourceTypeSuggestions"
      :filters="activityNames"
    />
    <ul v-if="activitiesWithMonthHeaders">
      <li v-for="(item, index) in activitiesWithMonthHeaders" :key="index">
        <span v-if="item.isHeader">{{ item.month }}</span>
        <div v-else>
          <strong>
            {{ formatName(item.activity.topic_data.name) }}
            {{ formatName(item.activity.resource_type) }}
          </strong>
          {{ formatDate(item.activity.d_created) }}
          <span
            v-if="
              item.activity.resource_type == 'quiz' ||
                item.activity.resource_type == 'easy_quiz' ||
                item.activity.resource_type == 'challenge'
            "
            style="color: blue;"
          >
            score {{ item.activity.score }}/10
          </span>

          <button
            v-if="
              item.activity.resource_type === 'quiz' ||
                item.activity.resource_type === 'easy_quiz' ||
                item.activity.resource_type === 'challenge' ||
                item.activity.resource_type === 'make_a_map' ||
                item.activity.resource_type === 'word_play' ||
                item.activity.resource_type === 'draw_about_it'
            "
            @click="TogglePopup(item.activity.id)"
          >
            view work
          </button>

          <ViewWorkComp
            v-if="popupTriggers[item.activity.id]"
            :TogglePopup="() => TogglePopup(item.activity.id)"
            :activity="iteactivity"
          >
            {{ formatName(item.activity.topic_data.name) }}
            {{ formatName(item.activity.resource_type) }}
            {{ formatDate(item.activity.d_created) }}
            {{ item.activity.comment }}
            <span
              v-if="
                item.activity.resource_type == 'quiz' ||
                  item.activity.resource_type == 'easy_quiz' ||
                  item.activity.resource_type == 'challenge'
              "
              >score {{ item.activity.score }}/10</span
            >
          </ViewWorkComp>
        </div>
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
      resourceTypeSuggestions: [],
      activityNames: []
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
        this.activityNames = this.activities.map(
          activity => `${activity.topic_data.name} ${activity.resource_type}`
        );
      });
    },

    TogglePopup(activityId) {
      this.popupTriggers[activityId] = !this.popupTriggers[activityId];
    },
    getMonthName(timestamp) {
      const date = new Date(timestamp * 1000);
      return date.toLocaleString("en-US", { month: "long" });
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
    formatName(name) {
      if (name.includes("_")) {
        return name.replace(/_/g, " ");
      }
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    searchActivities(query) {
      this.searchQuery = query;
    }
  },
  computed: {
    filteredActivities() {
      if (!this.activities) {
        return null;
      }

      let activities = [...this.activities];

      if (this.searchQuery) {
        const lowerCaseQuery = this.searchQuery.toLowerCase();
        activities = activities.filter(activity =>
          activity.resource_type.toLowerCase().includes(lowerCaseQuery)
        );
      }

      return activities.sort((a, b) => b.d_created - a.d_created);
    },

    activitiesWithMonthHeaders() {
      if (!this.filteredActivities) return null;

      const result = [];
      let currentMonth = "";

      this.filteredActivities.forEach(activity => {
        const activityMonth = this.getMonthName(activity.d_created);

        if (activityMonth !== currentMonth) {
          currentMonth = activityMonth;
          result.push({ isHeader: true, month: currentMonth });
        }

        result.push({ isHeader: false, activity: activity });
      });

      return result;
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
