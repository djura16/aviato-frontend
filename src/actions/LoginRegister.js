export function loginUser(values, callback) {
  let isResponseOk = false;
  let { username, password } = values;
  let data = {
    username: username,
    password: password
  };

  fetch("/api/Auth/login", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        isResponseOk = true;
      } else {
        isResponseOk = false;
      }
      return response.json();
    })
    .then(data => {
      if (isResponseOk) {
        sessionStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
      }
      callback(data.msg);
    });
}

export function registerUser(values, callback) {
  let { firstName, lastName, username, password, email } = values;
  let data = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
    email: email
  };

  let isResponseOk = false;

  fetch("/api/Auth/register", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        isResponseOk = true;
      } else {
        isResponseOk = false;
      }
      return response.json();
    })
    .then(data => {
      if (isResponseOk) {
        callback(undefined);
      } else {
        callback(data.msg);
      }
    });
}

export function logOutUser() {
  let bearer_token = sessionStorage.getItem("token");
  fetch("/api/Auth/logout", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearer_token
    }
  });
  window.onbeforeunload = null;
}
