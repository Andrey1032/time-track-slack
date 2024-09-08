const Router = require("express");
const router = new Router();
const axios = require("axios");

const { createEventAdapter } = require("@slack/events-api");
const slackSigningSecret = process.env.SLACK_SIGNAL_SECRET;

const slackEvents = createEventAdapter(slackSigningSecret, {
  includeBody: true,
  //waitForResponse: true,
});

slackEvents.on("message", async (event, body) => {
  //console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
  //console.log(`The event ID is ${body.event_id} and time is ${time}`);

  const time = new Date(body.event_time * 1000);

  let day = time.getDate();
  let month = time.getMonth() + 1;
  let year = time.getFullYear();
  let hours = time.getHours();
  let minutes = "0" + time.getMinutes();
  let formattedTime = hours + ":" + minutes.substr(-2);
  let formattedDate = `${year}-${month}-${day}`;

  if (event.subtype == "message_changed") {
    let data = {
      message_text: event.message.text,
      time_message: formattedTime,
      date: formattedDate,
      message_ts: event.message.ts,
      messageTypeChangeIdMessageTypeChange: 2,
    };
    try {
      const response = await axios({
        url: process.env.SLACK_URL_UPDATE_MESSAGE,
        method: "put",
        data: data,
      });
    } catch (error) {
      console.log("Error adding song", error);
    }
  } else if (event.subtype == "message_deleted") {
    let data = {
      message_ts: event.previous_message.ts,
    };
    try {
      const response = await axios({
        url: process.env.SLACK_URL_DELETE_MESSAGE,
        method: "delete",
        data: data,
      });
    } catch (error) {
      console.log("Error adding song", error);
    }
  } else {
    if (event.text == process.env.SLACK_EVENT_TEXT_START) {
      let data = {
        start_time: formattedTime,
        date: formattedDate,
        slackIdUser: event.user,
        workflowTimeTypeIdWorkflowTimeType: 2,
      };
      try {
        const response = await axios({
          url: process.env.SLACK_URL_POST_START_MESSAGE,
          method: "post",
          data: data,
        });
      } catch (error) {
        console.log("Error adding song", error);
      }
    } else if (event.text == process.env.SLACK_EVENT_TEXT_END) {  
      let data = {
        end_time_new: formattedTime,
        slackIdUser: event.user,
      };
      try {
        const response = await axios({
          url: process.env.SLACK_URL_POST_END_MESSAGE,
          method: "put",
          data: data,
        });

      } catch (error) {
        console.log("Error adding song", error);
      }
    } else {
      let data = {
        message_text: event.text,
        time_message: formattedTime,
        messageTypeIdMessageType: 3,
        slackIdUser: event.user,
        date: formattedDate,
        message_ts: event.ts,
        messageTypeChangeIdMessageTypeChange: 3,
      };
      try {
        const response = await axios({
          url: process.env.SLACK_URL_POST_CURRENT_MESSAGE,
          method: "post",
          data: data,
        });
      } catch (error) {
        console.log("Error adding song", error);
      }
    }
  }
});

router.use(process.env.SLACK_EVENTS_LISTENER_ROUTER, slackEvents.requestListener());

module.exports = router;
