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

async function nextCustomer(id){
  let req_URL = `${URL}/api/v1.0/tickets/serve-next`;
  return new Promise((resolve, reject) => {
    fetch(req_URL, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({counterNumber: id}),
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

const getCounters = async () => {
  const response = await fetch(URL + '/api/v1.0/counters', {
    credentials: 'include',
  });
  const counters = await response.json();
  if (response.ok) {
    return counters;
  } else {
    response.json()
      .then((message) => { reject(message); }) // error message in the response body
      .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
  }
};

const API = {getTicket, nextCustomer, getCounters};
export default API;