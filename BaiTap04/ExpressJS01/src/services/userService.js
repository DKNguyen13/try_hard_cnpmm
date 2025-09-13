require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const createUserService = async (name, email, password) => {
  try {
    //check user exist
    const user = await User.findOne({ email });
    if (user) {
      console.log(`>>> user exist, chọn 1 email khác: ${email}`);
      return null;
    }

    //hash user password
    const hashPassword = await bcrypt.hash(password, saltRounds);
    //save user to database
    let result = await User.create({
      name: name,
      email: email,
      password: hashPassword,
      role: "User",
    });
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginService = async (email, password) => {
  try {
    //fetch user by email
    const user = await User.findOne({ email: email });
    if (user) {
      //compare password
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return {
          EC: 2,
          EM: "Email/Password không hợp lệ",
        };
      } else {
        //create an access token
        const payload = {
          email: user.email,
          name: user.name,
        };

        const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE,
        });
        return {
          EC: 0,
          access_token,
          user: {
            email: user.email,
            name: user.name,
          },
        };
      }
    } else {
      return {
        EC: 1,
        EM: "Email/Password không hợp lệ",
      };
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getUserService = async () => {
  try {
    let result = await User.find({}).select("-password");
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const forgotPasswordService = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        EC: 1,
        EM: "Email không tồn tại trong hệ thống",
      };
    }

    // Tạo token reset (ngẫu nhiên)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    // Tạo link reset
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Cấu hình Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Nội dung email
    const mailOptions = {
      from: `"UTE Shop" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: `
        <h3>Xin chào ${user.name},</h3>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào link bên dưới để đặt lại:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>Link sẽ hết hạn sau 15 phút.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      EC: 0,
      EM: "Email đặt lại mật khẩu đã được gửi",
    };
  } catch (error) {
    console.log(error);
    return {
      EC: -1,
      EM: "Lỗi hệ thống",
    };
  }
};

const resetPasswordService = async (token, newPassword) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }, // token còn hạn
    });

    if (!user) {
      return { EC: 1, EM: "Token không hợp lệ hoặc đã hết hạn" };
    }

    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return { EC: 0, EM: "Đặt lại mật khẩu thành công" };
  } catch (error) {
    console.log(error);
    return { EC: -1, EM: "Lỗi hệ thống" };
  }
};

module.exports = {
  createUserService,
  loginService,
  getUserService,
  forgotPasswordService,
  resetPasswordService,
};
