export function loginUser(data) {
  let message;

  fetch("http://localhost:49474/api/RegistracijaIPrijava/prijava", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      return response.json();
    })
    .then(data => console.log(data));

  return message;
}
