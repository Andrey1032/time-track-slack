const { WebClient } = require("@slack/web-api");

const token = "xoxb-7327630759507-7341011438593-uMFxFIeUM2DXKa9k3UWuZfaG";
const web = new WebClient(token);

class aboutUser {
  async infoAboutUser(req, res) {
    const { id_slack_user } = req.query;
    try {
      const result = await web.users.info({
        user: id_slack_user,
      });

      let userAbout = {
        surname: result.user.profile.last_name,
        name: result.user.profile.first_name,
        login: result.user.profile.email,
      };

      return res.status(200).send(userAbout);
    } catch (error) {
      console.log(error);
      return res.status(404).send("Ошибка получения информации о пользователе");
    }
  }
}

module.exports = new aboutUser();
