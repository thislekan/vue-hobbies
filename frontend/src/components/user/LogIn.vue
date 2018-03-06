<template>
	<div>
		<br>
		<br>
		<div>
			<div class="col-lg-6 col-lg-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
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
				<button class="btn btn-success" @click="logIn">Log in</button>
			</div>
		</div>
	</div>
</template>

<script>
function handleResponse(res) {
  return res.json().then(data => {
    if (res.ok) {
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
    logIn() {
      const user = {
        email: this.$refs.email.value,
        password: this.$refs.password.value
      };
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      };
      fetch("/api/user/login", options)
        .then(res => {
          if (res.headers.has("x-auth")) {
            let token = res.headers.get("x-auth");
            sessionStorage.setItem("token", token);
            return res.json();
          } else {
            let error = Object.assign({}, res, {
              status: res.status,
              statusText: "Incorrect email or password"
            });
            return Promise.reject(error);
          }
        })
        .then(data => {
          //   console.log(data);
          sessionStorage.setItem("userID", data._id);
          sessionStorage.setItem("user", data.name);
          this.authenticateUser("users/me");
        })
        .catch(e => console.log(e));
    },
    authenticateUser() {
      const options = {
        method: "GET",
        headers: {
          "x-auth": sessionStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      };
      fetch("/api/user/confirm", options)
        .then(res => {
          if (res.status === 200) {
            setTimeout(() => {
              this.$router.push("/hobbies");
            }, 2000);
          } else {
            let error = Object.assign({}, res, {
              status: res.status,
              statusText: res.statusText
            });
            return Promise.reject(error);
          }
        })
        .catch(e => console.log(e));
    }
  }
};
</script>

<style scoped>
button {
  width: 100%;
}
</style>
