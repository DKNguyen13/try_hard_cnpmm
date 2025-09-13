import bcrypt from "bcryptjs";
import db from "../models"; // bỏ .js khi dùng TS

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, salt);
};

interface UserInput {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address?: string | null;
  phoneNumber?: string | null;
  gender: string; // "1" => true, else false
  roleId?: string | null;
  positionId?: string | null;
  image?: string | null;
}

export const createNewUser = async (data: UserInput): Promise<string> => {
  try {
    const hashPasswordFromBcrypt = await hashUserPassword(data.password);
    await db.User.create({
      email: data.email,
      password: hashPasswordFromBcrypt,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address || null,
      phoneNumber: data.phoneNumber || null,
      gender: data.gender === "1",
      roleId: data.roleId || null,
      positionId: data.positionId || null,
      image: data.image || null,
    });
    return "OK create a new user successful!";
  } catch (e: any) {
    console.error("Error in createNewUser:", e.parent?.sqlMessage || e);
    throw e;
  }
};

export const getAllUser = async (): Promise<any[]> => {
  try {
    return await db.User.findAll({ raw: true });
  } catch (e) {
    console.error("Error in getAllUser:", e);
    throw e;
  }
};

export const getUserInfoById = async (userId: string | number): Promise<any | null> => {
  try {
    console.log("Getting user by ID:", userId);

    const user = await db.User.findOne({
      where: { id: userId },
      raw: true,
    });

    console.log("Found user:", user);
    return user || null;
  } catch (e) {
    console.error("Error in getUserInfoById:", e);
    throw e;
  }
};

export const updateUser = async (data: Partial<UserInput>): Promise<any[]> => {
  try {
    const user = await db.User.findOne({
      where: { id: data.id },
    });

    if (user) {
      user.firstName = data.firstName || user.firstName;
      user.lastName = data.lastName || user.lastName;
      user.address = data.address || user.address;
      user.phoneNumber = data.phoneNumber || user.phoneNumber;

      await user.save();
      return await db.User.findAll();
    } else {
      return [];
    }
  } catch (e) {
    throw e;
  }
};

export const deleteUserById = async (userId: string | number): Promise<void> => {
  try {
    const user = await db.User.findOne({
      where: { id: userId },
    });
    if (user) {
      await user.destroy();
    }
  } catch (e) {
    throw e;
  }
};

export default {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUser,
  deleteUserById,
};
