const URL = 'http://localhost:3000';

async function getTicket(reservation){
  let req_URL = `${URL}/api/v1.0/tickets`;
  return new Promise((resolve, reject) => {
    fetch(req_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
    }).then((response) => {
      if (response.ok) {
        response.json()
          .then((obj) => resolve(obj))
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

const API = {getTicket};
export default API;