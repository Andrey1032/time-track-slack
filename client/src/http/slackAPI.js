import axios from "axios";

const $apiSlack = axios.create({
    baseURL: process.env.REACT_APP_SLACK_URL, // изменяется потому что free версия ngrok
});
export default $apiSlack;
