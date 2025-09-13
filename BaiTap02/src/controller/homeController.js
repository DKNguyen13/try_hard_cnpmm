import db from "../models/index.js";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  console.log(message);
  return res.send("Post crud to server");
};

let getFindAllCrud = async (req, res) => {
  try {
    let data = await CRUDService.getAllUser();
    console.log("Data from service:", data);

    // Kiểm tra đường dẫn view
    return res.render("users/findAllUser.ejs", {
      datalist: data,
    });
  } catch (error) {
    console.error("Error in getFindAllCrud:", error);
    return res.send("Error loading users");
  }
};

let getEditCRUD = async (req, res) => {
  try {
    let userId = req.query.id;
    console.log("Editing user ID:", userId); // ← Thêm log

    if (userId) {
      let userData = await CRUDService.getUserInfoById(userId);
      console.log("User data for edit:", userData); // ← Thêm log

      if (userData && userData.id) {
        return res.render("users/updateUser.ejs", {
          data: userData,
        });
      } else {
        return res.send("User not found");
      }
    } else {
      return res.send("không lấy được id");
    }
  } catch (error) {
    console.error("Error in getEditCRUD:", error);
    return res.send("Error loading edit page");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let allUsers = await CRUDService.updateUser(data);
  return res.render("users/findAllUser.ejs", {
    datalist: allUsers,
  });
};

let deleteCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDService.deleteUserById(id);
    return res.send("Deleted successfully!");
  } else {
    return res.send("Not find user");
  }
};

module.exports = {
  getHomePage,
  getAboutPage,
  getCRUD,
  postCRUD,
  getFindAllCrud,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
