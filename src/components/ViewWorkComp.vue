<template>
  <div class="popup">
    <div class="popup-inner">
      <div class="closepopup">
        <button @click="TogglePopup()">
          <img src="../../../assets/topics/cancel.png" alt="cancel" />
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: ["TogglePopup"]
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-inner {
  background: #fff;
  border: 1px solid;
  border-radius: 15px;
  padding: 58px;
  width: 500px;
  height: 200px;
  position: relative;
}

button {
  border: none;
  background-color: #fff;
}

.closepopup {
  top: 10px;
  right: 10px;
  position: absolute;
}

img {
  width: 20px;
}
</style>
