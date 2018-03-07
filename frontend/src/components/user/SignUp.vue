<template>
	<div>
		<br>
		<br>
		<div>
			<div class="col-lg-6 col-lg-offset-3 col-sm-8 col-sm-offset-2 col-xs-12" style="position: relative">
				<div class="form-group loader-div">
					<div class="loader" v-show="isLoading"></div>
				</div>
				<div class="form-group">
					<p class="alert alert-danger" ref="notifyUser" v-show="isNotified" @click="dismiss"></p>
				</div>
				<div class="form-group">
					<label for="name">Name</label>
					<input type="text" name="name" ref="name" placeholder="User's name" class="form-control">
				</div>
				<div class="form-group">
					<label for="phone">Phone Number</label>
					<input name="phone" ref="phone" placeholder="08133000000" class="form-control" @focus="inform">
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" name="email" ref="email" placeholder="user@email.com" class="form-control" @focus="inform">
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
  data() {
    return {
      isNotified: false,
      isLoading: false
    };
  },
  methods: {
    signUp() {
      const user = {
        email: this.$refs.email.value,
        name: this.$refs.name.value,
        password: this.$refs.password.value,
        phone: this.$refs.phone.value
      };
      if (
        user.email === "" ||
        user.phone === "" ||
        user.password === "" ||
        user.name === ""
      ) {
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
        //   console.log(user);
        fetch("/api/user", options)
          .then(handleResponse)
          .then(data => {
            console.log(data);
            setTimeout(() => {
              this.$router.push("/login");
            }, 2000);
          })
          .catch(e => {
            this.isLoading = false;
            this.$refs.notifyUser.innerText = `An error occured. Try again? Click to dismiss`;
            this.isNotified = true;
          });
      }
    },
    dismiss() {
      this.isNotified = false;
    },
    inform(e) {
      if (e.target === this.$refs.phone) {
        this.$refs.notifyUser.className = "alert alert-warning";
        this.$refs.notifyUser.innerText =
          "Please, ensure you register with a valid phone number. Click to dismiss";
        this.isNotified = true;
      } else {
        this.$refs.notifyUser.className = "alert alert-warning";
        this.$refs.notifyUser.innerText =
          "Please, ensure you register with a valid email. Click to dismiss";
        this.isNotified = true;
      }
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
  .loader-div {
    left: 40%;
    right: 40%;
  }
}
</style>
