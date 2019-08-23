export function getNotifications(callback) {
  let bearer_token = sessionStorage.getItem("token");
  fetch(`/api/Notification/getNotifications`, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearer_token
    }
  })
    .then(response => response.json())
    .then(data => callback(data));
}
