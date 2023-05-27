<template>
  <div class="header">
    <h3>Timeline</h3>
    <div class="header-content">
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          v-model="searchQuery"
          placeholder="Search timeline"
          @input="updateSearchQuery"
        />
        <ul class="suggestList" v-if="showSuggestions && filteredSuggestions.length">
          <div>
            <li
              class="suggestListItem"
              v-for="(suggestion, index) in filteredSuggestions"
              :key="index"
              @click="selectSuggestion(suggestion)"
            >
              {{ formatName(suggestion) }}
            </li>
          </div>
        </ul>
        <button @click="handleSearch">
          <img src="../../../assets/topics/magnifying-glass.png" alt="magnifying glass" />
        </button>
      </div>
      <div class="filterList">
        <span>filter by:</span>
        <ul class="byFilterList">
          <li
            @click="filterSearch('')"
            class="byFilterListItem"
            :class="{ 'selected-filter': selectedFilter === '' }"
          >
            All Work
          </li>
          <li
            @click="filterSearch(s)"
            class="byFilterListItem"
            v-for="s in suggestions"
            :key="s.index"
            :class="{ 'selected-filter': selectedFilter === s }"
          >
            {{ formatName(s) }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    suggestions: {
      type: Array,
      required: true
    },
    filters: {
      type: Array,
      required: true
    },
    activityNames: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      searchQuery: "",
      showSuggestions: false,
      selectedFilter: ""
    };
  },
  computed: {
    filteredSuggestions() {
      if (this.searchQuery === "") {
        return this.activityNames;
      }
      const searchLowerCase = this.searchQuery.toLowerCase();

      return this.activityNames.filter(f => f.toLowerCase().includes(searchLowerCase));
    },
    filteredActivities() {
      if (this.searchQuery === "") {
        return this.activities;
      }
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      return this.activities.filter(activity =>
        `${activity.topic_data.name} ${activity.resource_type}`
          .toLowerCase()
          .includes(lowerCaseQuery)
      );
    }
  },
  methods: {
    formatName(name) {
      if (name.includes("_")) {
        return name.replace(/_/g, " ");
      }
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    handleSearch() {
      this.$emit("search", this.searchQuery);
    },
    filterSearch(suggestion) {
      this.selectedFilter = suggestion;
      this.$emit("filter", suggestion);
    },
    updateSearchQuery() {
      this.showSuggestions = true;
    },
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion;
      this.showSuggestions = false;
      this.$emit("select", suggestion);
    }
  }
};
</script>

<style scoped>
.header {
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-block-start: 5px;
  margin-block-end: 5px;
}

h3 {
  margin: initial;
}

.filterList {
  display: contents;
}

span {
  font-size: 12px;
}

img {
  width: 10px;
  background-color: #068283ff;
}

button {
  background-color: #068283ff;
  border: 1px solid #068283ff;
  border-radius: 3%;
}
.search-container {
  display: flex;
  position: relative;
  align-items: center;
  margin-block-start: 5px;
  margin-block-end: 5px;
}

.search-input {
  width: 200px;
}

.suggestList {
  list-style-type: none;
  display: inline-block;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 100;
  border: 1px solid #ccc;
  padding: 0;
  margin: 0;
}

.suggestListItem {
  list-style-type: none;
  padding: 5px;
}

.byFilterList {
  list-style-type: none;
  padding: 0;
  display: flex;
  margin-top: 5px;
}

.byFilterListItem {
  display: inline-block;
  border: 1px solid;
  margin: 5px;
  width: fit-content;
  color: #068283ff;
  border-radius: 4px;
  padding: 8px;
  margin: 4px;
  font-size: 12px;
}

.selected-filter {
  background-color: #edfcfcff;
}
</style>
