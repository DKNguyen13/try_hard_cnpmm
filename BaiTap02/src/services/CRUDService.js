import bcrypt from "bcryptjs";

import db from "../models/index.js";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address || null,
        phoneNumber: data.phoneNumber || null,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId || null,
        positionId: data.positionId || null,
        image: data.image || null,
      });
      resolve("OK create a new user successful!");
    } catch (e) {
      console.error("Error in createNewUser:", e.parent?.sqlMessage || e); // in chi tiết SQL error
      reject(e);
    }
  });
};


let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      console.error("Error in getAllUser:", e);
      reject(e);
    }
  });
};

let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Getting user by ID:", userId); // ← Thêm log

      let user = await db.User.findOne({
        where: { id: userId },
        raw: true,
      });

      console.log("Found user:", user); // ← Thêm log

      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    } catch (e) {
      console.error("Error in getUserInfoById:", e);
      reject(e);
    }
  });
};

let updateUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });

      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        await user.save();

        let allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (user) {
        await user.destroy();
      }
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUser,
  deleteUserById,
};
