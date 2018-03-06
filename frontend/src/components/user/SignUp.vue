<template>
	<div>
		<br>
		<br>
		<div>
			<div class="col-lg-6 col-lg-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
				<div class="form-group">
					<label for="name">Name</label>
					<input type="text" name="name" ref="name" placeholder="User's name" class="form-control">
				</div>
				<div class="form-group">
					<label for="phone">Phone Number</label>
					<input type="number" name="phone" ref="phone" placeholder="08133000000" class="form-control">
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" name="email" ref="email" placeholder="user@email.com" class="form-control">
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" name="password" ref="password" class="form-control">
				</div>
			</div>
			<div class="col-xs-12 col-sm-4 col-sm-offset-4 col-lg-2 col-lg-offset-5">
				<button class="btn btn-success" @click="signUp">Sign Up</button>
			</div>
		</div>
		<!-- <div class="row">

		</div> -->
	</div>
</template>

<script>
function handleResponse(res) {
  return res.json().then(data => {
    if (res.status === 200) {
      return data;
    } else {
      let error = Object.assign({}, res, {
        status: res.status,
        statusText: res.statusText
      });
      return Promise.reject(error);
    }
  });
}

export default {
  methods: {
    signUp() {
      const user = {
        email: this.$refs.email.value,
        name: this.$refs.name.value,
        password: this.$refs.password.value,
        phone: this.$refs.phone.value
      };
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      };
      //   console.log(user);
      fetch("/api/user", options)
        .then(handleResponse)
        .then(data => {
          console.log(data);
          setTimeout(() => {
            this.$router.push("/login");
          }, 2000);
        })
        .catch(e => console.log(e));
    }
  }
};
</script>

<style>
button {
  width: 100%;
}
</style>
