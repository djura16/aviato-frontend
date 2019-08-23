import { HubConnectionBuilder } from "@aspnet/signalr";

export function signalR(username, callback) {
  let hubConnection;

  hubConnection = new HubConnectionBuilder()
    .withUrl("http://localhost:5001/posthub")
    .build();

  let bearer_token = sessionStorage.getItem("token");
  fetch(`/api/Following/getOnlineFollowing?username=${username}`, {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearer_token
    }
  })
    .then(response => response.json())
    .then(data => {
      callback(hubConnection, data);
    });
}

export function notificationSignal(callback) {
  let hubConnection;

  hubConnection = new HubConnectionBuilder()
    .withUrl("http://localhost:5001/posthub")
    .build();

  callback(hubConnection);
}
