// const {User_Role} = require('../database/models')
const { User_Role } = require("../database/userRoleModel");

class UserRoleController {
  async createUserRole(req, res) {
    const { name_role } = req.body;
    try {
      const userRole = await User_Role.create({ name_role });
      return res.json(userRole);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка записи роли пользователя");
    }
  }

  async updateUserRole(req, res) {
    const { id_user_role } = req.params;
    const { name_role } = req.body;
    try {
      const userRole = await User_Role.update(
        { name_role },
        { where: { id_user_role } }
      );
      return res.json(userRole);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка обновления роли пользователя");
    }
  }

  async deleteUserRole(req, res) {
    const { id_user_role } = req.params;
    try {
      const userRole = await User_Role.destroy({ where: { id_user_role } });
      return res.json(userRole);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка удаления роли пользователя");
    }
  }
}

module.exports = new UserRoleController();
