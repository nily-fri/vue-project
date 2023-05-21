<template>
  <div class="header">
    <h3>Timeline</h3>
    <div class="header-content">
      <div class="search-container">
        <input
          type="text"
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
            @click="filterSearch"
            class="byFilterListItem"
            v-for="s in suggestions"
            :key="s.index"
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
    }
  },
  data() {
    return {
      searchQuery: "",
      showSuggestions: false
    };
  },
  computed: {
    filteredSuggestions() {
      if (this.searchQuery === "") {
        console.log(filters);
        return this.filters;
      }
      const searchLowerCase = this.searchQuery.toLowerCase();
      return this.filters.filter(f => f.toLowerCase().includes(searchLowerCase));
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
    filterSearch() {
      this.selectSuggestion();
    },
    updateSearchQuery() {
      this.showSuggestions = true;
    },
    selectSuggestion(suggestion) {
      this.searchQuery = suggestion;
      this.showSuggestions = true;
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
  background-color: green;
}

button {
  background-color: green;
  border: 1px solid green;
  border-radius: 3%;
}
.search-container {
  display: flex;
  align-items: center;
  margin-block-start: 5px;
  margin-block-end: 5px;
}

.suggestList {
  list-style-type: none;
  position: relative;
  display: inline-block;
}

.autocomplete {
  position: relative;
  display: inline-block;
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
  color: green;
  border-radius: 4px;
  padding: 8px;
  margin: 4px;
  font-size: 12px;
}
</style>
