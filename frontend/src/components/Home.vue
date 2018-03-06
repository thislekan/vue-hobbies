<template>
	<div class="home">
		<div class="col-xs-12">
			<h1 class="text-center">Hobbies</h1>
		</div>
		<div>
			<div class="col-xs-12">
				<h3 class="text-center" style="color: white">What are your hobbies?</h3>
			</div>
		</div>
		<button class="btn btn-success" @click="getStarted">Get Started</button>
	</div>
</template>

<script>
import HeaderVue from "./Header.vue";
export default {
  components: {
    appHeader: HeaderVue
  },
  methods: {
    getStarted() {
      this.$router.push("/signup");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  width: 250px;
}
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
</style>
