import { Request, Response } from "express";
import db from "../models"; // bỏ .js vì TS sẽ hiểu file .ts/.js
import CRUDService from "../services/CRUDService";

export const getHomePage = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await db.User.findAll();
    res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.error(e);
    res.send("Error loading homepage");
  }
};

export const getAboutPage = (req: Request, res: Response): void => {
  res.render("test/about.ejs");
};

export const getCRUD = (req: Request, res: Response): void => {
  res.render("crud.ejs");
};

export const postCRUD = async (req: Request, res: Response): Promise<void> => {
  const message = await CRUDService.createNewUser(req.body);
  console.log(message);
  res.send("Post crud to server");
};

export const getFindAllCrud = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await CRUDService.getAllUser();
    console.log("Data from service:", data);

    res.render("users/findAllUser.ejs", {
      datalist: data,
    });
  } catch (error) {
    console.error("Error in getFindAllCrud:", error);
    res.send("Error loading users");
  }
};

export const getEditCRUD = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.query.id as string | undefined;
    console.log("Editing user ID:", userId);

    if (userId) {
      const userData = await CRUDService.getUserInfoById(userId);
      console.log("User data for edit:", userData);

      if (userData && userData.id) {
        res.render("users/updateUser.ejs", {
          data: userData,
        });
      } else {
        res.send("User not found");
      }
    } else {
      res.send("Không lấy được id");
    }
  } catch (error) {
    console.error("Error in getEditCRUD:", error);
    res.send("Error loading edit page");
  }
};

export const putCRUD = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const allUsers = await CRUDService.updateUser(data);
  res.render("users/findAllUser.ejs", {
    datalist: allUsers,
  });
};

export const deleteCRUD = async (req: Request, res: Response): Promise<void> => {
  const id = req.query.id as string | undefined;
  if (id) {
    await CRUDService.deleteUserById(id);
    res.send("Deleted successfully!");
  } else {
    res.send("Not find user");
  }
};
