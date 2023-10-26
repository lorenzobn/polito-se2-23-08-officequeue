const URL = 'http://localhost:3000/api/v1.0';

async function getServices() {

    const response = await fetch(URL + `/service-types`);
    const services = await response.json();
    if (response.ok) {
        return Object.assign({}, services);
    } else {
        throw services;
    }
}

const API = {  getServices };
export default API;