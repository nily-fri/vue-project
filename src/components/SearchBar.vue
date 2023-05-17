<template>
  <div class="header">
    <h3>Timeline</h3>
    <div class="header-content">
      <div class="search-container">
        <input
          type="text"
          :suggestions="suggestions"
          v-model="searchQuery"
          placeholder="Search timeline"
        />
        <button @click="handleSearch">
          <img src="../../../assets/topics/magnifying-glass.png" alt="magnifying glass" />
        </button>
      </div>
      <div class="filterList">
        <span>filter by:</span>
        <ul>
          <li v-for="s in suggestions" :key="s.index">
            {{ s }}
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
    }
  },
  data() {
    return {
      searchQuery: ""
    };
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.searchQuery);
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

ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  margin-top: 5px;
}

li {
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
