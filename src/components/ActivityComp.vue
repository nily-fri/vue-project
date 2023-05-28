<template>
  <div>
    <SearchBar
      @select="selectActivity"
      @filter="searchActivities"
      :suggestions="resourceTypeSuggestions"
      :filters="activityNames"
      :activityNames="activityNames"
    />
    <ul v-if="activitiesWithMonthHeaders">
      <li v-for="(item, index) in activitiesWithMonthHeaders" :key="index">
        <div v-if="item.isHeader">
          <div class="month-container">
            <span class="month">{{ item.month }}</span>
          </div>
        </div>
        <div class="container" v-else>
          <div style="display: flex; padding-right: 10px;">
            <img
              class="icon"
              :src="'../' + item.activity.topic_data.icon_path"
              :alt="item.activity.topic_data.name"
            />
            <img
              v-if="item.activity.product == 'bpjr'"
              :src="'../' + item.activity.topic_data.icon_path"
              class="product"
            />
            <div class="title">
              <strong>
                {{ formatName(item.activity.topic_data.name) }}
                {{ formatName(item.activity.resource_type) }}
              </strong>
              <span class="timestamp"> {{ formatDate(item.activity.d_created) }} </span>
            </div>
          </div>
          <div class="score">
            <span
              v-if="
                item.activity.resource_type == 'quiz' ||
                  item.activity.resource_type == 'easy_quiz' ||
                  item.activity.resource_type == 'challenge'
              "
              style="color: #068283ff;"
            >
              score <strong> {{ item.activity.score }}/10 </strong>
            </span>

            <button
              class="viewWork"
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
              <img class="eye-icon" src="../../../assets/topics/eye.png" alt="eye" />
              view work
            </button>
          </div>
          <ViewWorkComp
            v-if="popupTriggers[item.activity.id]"
            :TogglePopup="() => TogglePopup(item.activity.id)"
            :activity="item.activity"
          >
            <img
              class="popup-img"
              :src="'../' + item.activity.topic_data.icon_path"
              :alt="item.activity.topic_data.name"
            />
            <div class="popup-title">
              {{ formatName(item.activity.topic_data.name) }}
              {{ formatName(item.activity.resource_type) }}
            </div>
            <div class="popup-date">{{ formatDate(item.activity.d_created) }}</div>

            <div class="popup-comment">
              {{ item.activity.comment }}
              <br />
              <span
                v-if="
                  item.activity.resource_type == 'quiz' ||
                    item.activity.resource_type == 'easy_quiz' ||
                    item.activity.resource_type == 'challenge'
                "
                >score {{ item.activity.score }}/10</span
              >
            </div>
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
    },

    selectActivity(activityName) {
      this.activities = this.activities.filter(
        activity => `${activity.topic_data.name} ${activity.resource_type}` === activityName
      );
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
.container {
  display: flex;
  justify-content: space-between;
}

ul {
  list-style-type: none;
  padding: 0;
  display: grid;
}
li {
  display: inline-grid;
  margin: 0 10px;
  border: 1px solid;
  padding: 15px;
  margin: 5px;
}

.icon {
  width: 40px;
  left: 0;
  display: flex;
  border-radius: 100%;
  margin-right: 16px;
}

.month-container {
  border-radius: 4%;
  text-align: left;
}

.month {
  background-color: #fcf8e4;
  width: fit-content;
}

.title {
  text-align: left;
}

.score {
  text-align: right;
}

.product {
  background-color: orange;
  border-radius: 100%;
  position: absolute;
  left: 60px;
  margin-top: 25px;
  width: 15px;
}

.viewWork {
  border: none;
  background-color: white;
  color: #068283ff;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
}

.timestamp {
  font-size: 12px;
  text-align: left;
  display: block;
}

.eye-icon {
  width: 15px;
  margin-right: 6px;
}

.popup-title {
  text-align: center;
  font-size: 25px;
  margin: 30px;
}

.popup-date {
  text-align: center;
}

.popup-comment {
  text-align: left;
}

.popup-img {
  width: 40px;
  border-radius: 100%;
}
</style>
