<template>
	<div>
		<br>
		<br>
		<div>

			<div class="col-lg-6 col-lg-offset-3 col-sm-8 col-sm-offset-2 col-xs-12" style="position: relative">
				<div class="text-center loader-div">
					<div class="loader" v-show="isLoading"></div>
				</div>
				<div class="form-group">
					<p class="alert alert-danger" ref="notifyUser" v-show="isNotified" @click="dismiss"></p>
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
  data() {
    return {
      isNotified: false,
      isLoading: false
    };
  },
  methods: {
    logIn() {
      const user = {
        email: this.$refs.email.value,
        password: this.$refs.password.value
      };
      if (user.email === "" || user.password === "") {
        this.isLoading = false;
        this.$refs.notifyUser.innerText = `Input fields cannot be empty. Click to dismiss.`;
        this.isNotified = true;
      } else if (user.password.length < 6) {
        this.isLoading = false;
        this.$refs.notifyUser.innerText =
          "Your password has to be equal to or greater than 6. Click to dismiss";
        this.isNotified = true;
      } else {
        this.isLoading = true;
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
          .catch(e => {
            this.isLoading = false;
            this.$refs.notifyUser.innerText = `An error occured. Try again? Click to dismiss`;
            this.isNotified = true;
          });
      }
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
        .catch(e => {
          this.isLoading = false;
          this.$refs.notifyUser.innerText = `User not authorized. Click to dismiss`;
          this.isNotified = true;
        });
    },
    dismiss() {
      this.isNotified = false;
    }
  }
};
</script>

<style>
button {
  width: 100%;
}
.loader-div {
  position: absolute;
  left: 30%;
  right: 30%;
  top: 25%;
  z-index: 3;
}
.loader {
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@media screen and (min-device-width: 700px) {
  .loader {
    left: 40%;
    right: 40%;
  }
}
</style>
