<template>
	<div id="app">
		<!-- <h1>Hello World</h1> -->
		<app-header class="comp-header"></app-header>
		<transition name="fade" mode="out-in">
			<router-view class="comp">
				<app-home></app-home>
			</router-view>
		</transition>
	</div>
</template>

<script>
import HomeVue from "./components/Home.vue";
import HeaderVue from "./components/Header.vue";
export default {
  name: "App",
  components: {
    appHeader: HeaderVue,
    appHome: HomeVue
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  height: 90vh;
}
.home {
  background-image: url("assets/chilling.png");
  background-size: cover;
  background-position: center;
  background-clip: padding-box;
}
.comp-header {
  margin-top: 10px;
  margin-bottom: 10px;
}
.comp {
  height: 90%;
}

.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  transition: opacity 1s;
}
.fade-leave-active {
  transition: opacity 1s;
  opacity: 0;
}
</style>
