import axios from "axios";

const $apiSlack = axios.create({
    baseURL: "https://0c98-95-71-178-14.ngrok-free.app", // изменяется потому что free версия ngrok
});
export default $apiSlack;
