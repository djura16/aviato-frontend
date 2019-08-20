export function getUser(username = null, callback) {
  //get profile from loged in user, if not null, get profile of user by username
  if (username === null) {
    username = JSON.parse(localStorage.getItem("user")).username;
  }

  let bearer_token = sessionStorage.getItem("token");
  fetch(`/api/User/getUserByUsername?username=${username}`, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearer_token
    }
  })
    .then(response => response.json())
    .then(data => {
      callback(data);
    });
}

export function getFollowing(username, callback) {
  let bearer_token = sessionStorage.getItem("token");
  let users = [];

  fetch(`/api/Following/getFollowing?username=${username}`, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearer_token
    }
  })
    .then(response => response.json())
    .then(data => {
      data.map(user => users.push(user.followed));
      callback(users);
    });
}

export function getFollowers(username, callback) {
  let bearer_token = sessionStorage.getItem("token");
  let users = [];

  fetch(`/api/Following/getFollowers?username=${username}`, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearer_token
    }
  })
    .then(response => response.json())
    .then(data => {
      data.map(user => users.push(user.follower));
      callback(users);
    });
}
