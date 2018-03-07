<template>
	<div class="container">
		<h1 class="text-center">Hello {{user}}</h1>
		<br><br>
		<div class="row">
			<div class="col-xs-12 col-sm-5 col-lg-4" id="box1">
				<br>
				<div class="form-group">
					<div class="input-group">
						<input type="text" name="" id="" class="form-control" ref="newHobby" @keyup="previewHobby" placeholder="Enter your replies here">
						<span class="input-group-btn">
							<button class="btn btn-success" @click="showHobby">Submit</button>
						</span>
					</div>
					<br>
					<div class="form-group">
						<p class="form-control">{{newHobby}}</p>
					</div>
				</div>
			</div>
			<div class="col-lg-4 col-sm-2"></div>
			<div class="col-xs-12 col-sm-5 col-lg-4" id="box2">
				<p class="text-center" style="margin-top: 10px; margin-bottom: 10px">Hobbies</p>
				<div class="form-group">
					<ul class="list-group">
						<li name="" id="" class="list-group-item" v-if="show" v-for="(hobby, index) in hobbyList" :key="hobby" @click="deleteHobby(index)">
							<p>{{hobby}}</p>
						</li>
					</ul>
				</div>
				<div class="text-center" style="margin-bottom: 10px">
					<button class="btn btn-info similar-btn">Refresh</button>
				</div>
			</div>
		</div>
		<br>
		<br>
		<br>
		<div class="row">
			<div class="col-xs-12 col-sm-4 col-sm-offset-4 col-lg-4 col-lg-offset-4 text-center">
				<button class="btn btn-danger similar-btn" id="refresh" @click="logOut">Log out</button>
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

function sendEmail(emailBody) {
  //send Email
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth": sessionStorage.getItem("token")
    },
    body: JSON.stringify(emailBody)
  };

  fetch("/api/user/sendEmail", params)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .then(feedback => console.log(feedback))
    .catch(e => console.log(e));
}

function sendText(recentHobby) {
  //send text
  let params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth": sessionStorage.getItem("token")
    },
    body: JSON.stringify({ text: `You created a new hobby: ${recentHobby}` })
  };

  fetch("/api/user/sendText", params)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
    })
    .then(feedback => console.log(feedback))
    .catch(e => console.log(e));
}
export default {
  data() {
    return {
      user: "User",
      hobbyList: [],
      newHobby: "One word reply to your hobby?",
      show: false
    };
  },
  methods: {
    previewHobby(e) {
      this.newHobby = "I love " + e.target.value;
    },

    showHobby() {
      const hobby = this.$refs.newHobby.value;
      this.show = true;
      let listOfHobbies = [];
      let url = "/api/hobbies";
      if (hobby !== "") {
        this.hobbyList.push(hobby);
        for (let i = 0; i < this.hobbyList.length; i++) {
          const element = this.hobbyList[i];
          listOfHobbies.push(element);
        }

        let options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth": sessionStorage.getItem("token")
          },
          body: JSON.stringify({ hobbies: listOfHobbies })
        };

        if (this.hobbyList.length > 1) {
          options.method = "PUT";
          let uniqueID = sessionStorage.getItem("userID");
          let hobbyID = localStorage.getItem(`${uniqueID}ID`);
          url = `${url}/${hobbyID}`;
          fetch(url, options)
            .then(res => res.json())
            .then(data => {
              console.log(data);
              let emailBody = { subject: "New Hobby created", text: hobby };
              sendEmail(emailBody);
              sendText(hobby);
            })
            .catch(e => console.log(e));
        } else {
          fetch(url, options)
            .then(handleResponse)
            .then(data => {
              console.log(data);
              let user = sessionStorage.getItem("userID");
              localStorage.setItem(`${user}ID`, data._id);
              let emailBody = { subject: "New Hobby created", text: hobby };
              sendEmail(emailBody);
              sendText(hobby);
            })
            .catch(e => console.log(e));
        }
      }
      this.newHobby = "One word reply to your hobby?";
    },

    logOut() {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth": sessionStorage.getItem("token")
        }
      };
      fetch("/api/user/logout", options)
        .then(res => {
          if (res.status === 200) {
            // console.log("it worked");
            // return res.json();
            sessionStorage.clear();
            this.$router.push("/");
          }
        })
        .catch(e => console.log(e));
    },

    deleteHobby(index) {
      this.hobbyList.splice(index, 1);

      let listOfHobbies = [];
      for (let i = 0; i < this.hobbyList.length; i++) {
        const element = this.hobbyList[i];
        listOfHobbies.push(element);
      }
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth": sessionStorage.getItem("token")
        },
        body: JSON.stringify({ hobbies: listOfHobbies })
      };

      let uniqueID = sessionStorage.getItem("userID");
      let hobbyID = localStorage.getItem(`${uniqueID}ID`);
      let url = `/api/hobbies/${hobbyID}`;
      fetch(url, options)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(e => console.log(e));
    }
  },
  created() {
    this.$store.commit("alterState");

    if (sessionStorage.getItem("user")) {
      this.user = sessionStorage.getItem("user");
    }
    if (!sessionStorage.getItem("token")) {
      this.$router.push("/");
    }

    let user = sessionStorage.getItem("userID");
    const dataID = localStorage.getItem(`${user}ID`);
    if (dataID) {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth": sessionStorage.getItem("token")
        }
      };
      fetch(`/api/hobbies/${dataID}`, options)
        .then(handleResponse)
        .then(data => {
          for (let i = 0; i < data.hobbies.hobbies.length; i++) {
            const element = data.hobbies.hobbies[i];
            this.hobbyList.push(element);
          }
        })
        .catch(e => console.log(e));
      this.show = true;
    }
  },
  destroyed() {
    this.$store.commit("alterState", true);
  }
};
</script>

<style>
#box1,
#box2 {
  border: 1px solid gainsboro;
  margin-bottom: 20px;
}
.similar-btn {
  width: 150px;
}
@media screen and (max-device-width: 400px) {
  .row {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>

