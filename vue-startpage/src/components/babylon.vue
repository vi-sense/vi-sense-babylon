<template>
    <canvas id="canvas"></canvas>
</template>

<script>
import MyScene from "assets/MyBabylonScene.js";
export default {
  name: "Babylon",
  data() {
    return {
      scene
    }
  },
  mounted() {
    var canvas = document.getElementById("canvas")
    this.scene = new MyScene(canvas);
    this.scene.doAction()
  },
}