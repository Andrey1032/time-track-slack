const bcrypt = require("bcrypt");
const Sequelize = require("sequelize");
const { Department, User, Account_Data } = require("../database/models");

class DepartmentController {
  async createDepartment(req, res) {
    const { name_department, slack, aboutMeneg } = req.body;
    let user, user2;
    try {
      const department = await Department.create({
        name_department,
        slack,
      });

      if (aboutMeneg.password || aboutMeneg.login || aboutMeneg.slack || aboutMeneg.name || aboutMeneg.surname || aboutMeneg.middle_name) {
        if (!aboutMeneg.login || !aboutMeneg.password) {
          //return next(ApiError.badRequest('Некорректный login или password'))
          return res.status(401).send("Некорректный login или password");
        }
        const candidate = await Account_Data.findOne({
          where: { login: aboutMeneg.login },
        });
        if (candidate) {
          //return next(ApiError.badRequest('Пользователь с таким login уже существует'))
          return res
            .status(401)
            .send("Пользователь с таким login уже существует");
        }
        const hashPassword = await bcrypt.hash(aboutMeneg.password, 5);

        try {
          user = await Account_Data.create({
            slack: aboutMeneg.slack,
            login: aboutMeneg.login,
            password: hashPassword,
          });

          user2 = await User.create({
            surname: aboutMeneg?.surname,
            name: aboutMeneg?.name,
            middle_name: aboutMeneg?.middle_name,
            userRoleIdUserRole: 2,
            departmentIdDepartment: department.id_department,
            accountDatumIdAccountData: user.id_account_data,
          });

          const departmentUpdate = await Department.update(
            {
              userIdUser: user2.id_user,
            },
            { where: { id_department: department.id_department } }
          );
        } catch (error) {
          console.log(error);
          return res
            .status(500)
            .send("Ошибка заполнения идентификационных или личных данных");
        }
      }

      return res.json([department, user, user2]);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка создания отдела");
    }
  }

  async getAllDepartment(req, res) {
    let { id_department } = req.query,
      department,
      departmentF;
    try {
      if (id_department) {
        department = await Department.findOne({
          where: { id_department },
          include: [
            {
              association: "users",
              attributes: ["id_user", "surname", "name", "middle_name"],
              include: {
                model: Account_Data,
                attributes: { exclude: ["id_account_data", "password"] },
              },
            },
          ],
          attributes: [
            "id_department",
            "slack",
            "userIdUser",
            ["name_department", "title"],
          ],
        });
      } else {
        department = await Department.findAll({
          include: [
            {
              association: "users",
              attributes: ["id_user", "surname", "name", "middle_name"],
              include: {
                model: Account_Data,
                attributes: { exclude: ["id_account_data", "password"] },
              },
            },
          ],
          attributes: [
            "id_department",
            "slack",
            "userIdUser",
            ["name_department", "title"],
          ],
        });
      }

      departmentF = JSON.parse(JSON.stringify(department));

      if (Array.isArray(departmentF)) {
        departmentF.sort((a, b) => {
          return a.id_department - b.id_department;
        });
        departmentF.forEach((el) => {
          el.users.sort((a, b) =>
            a.surname.localeCompare(b.surname, undefined, {
              sensitivity: "base",
            })
          );
        });
      } else {
        departmentF.users.sort((a, b) =>
          a.surname.localeCompare(b.surname, undefined, { sensitivity: "base" })
      );
    }
    
      return res.status(200).send(departmentF);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка получения отдела(отделов)");
    }
  }

  async updateDepartment(req, res) {
    console.log({ query: req.query, params: req.params });
    const { id_department } = req.params;
    const { name_department, slack, userIdUser } = req.body;
    try {
      const department_old = await Department.findOne({
        where: { id_department },
      });
      const department = await Department.update(
        {
          name_department: name_department
            ? name_department
            : department_old.name_department,
          slack: slack ? slack : department_old.slack,
          userIdUser: userIdUser ? userIdUser : department_old.userIdUser,
        },
        { where: { id_department } }
      );
      if (userIdUser) {
        const user = await User.update(
          { userRoleIdUserRole: 3 },
          { where: { id_user: department_old.userIdUser } }
        );
        const user2 = await User.update(
          { userRoleIdUserRole: 2 },
          { where: { id_user: userIdUser } }
        );
      }
      return res.json(department);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка обновления отдела");
    }
  }

  async deleteDepartment(req, res) {
    const { id_department } = req.params;
    try {
      const department = await Department.destroy({ where: { id_department } });
      return res.json(department);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Ошибка удаления отдела");
    }
  }
}

module.exports = new DepartmentController();
