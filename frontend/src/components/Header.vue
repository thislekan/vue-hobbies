<template>
	<div>
		<ul class="nav nav-pills">
			<router-link to="/" tag="li" active-class="active" exact="">
				<a>Home</a>
			</router-link>
			<router-link to="/signup" tag="li" active-class="active" v-show="visible">
				<a>Sign up</a>
			</router-link>
			<router-link to="/login" tag="li" active-class="active" v-show="visible">
				<a>Log in</a>
			</router-link>
			<router-link to="/hobbies" tag="li" active-class="active">
				<a>Hobbies</a>
			</router-link>
		</ul>
	</div>
</template>

<script>
export default {
  computed: {
    visible() {
      return this.$store.state.visible;
    }
  }
};
</script>

<style scoped>
ul {
  display: flex;
  justify-content: center;
}
@media screen and (min-device-width: 600px) {
  div {
    margin-left: 25%;
    margin-right: 25%;
  }
  ul {
    width: 100%;
    justify-content: space-around;
  }
}
</style>
