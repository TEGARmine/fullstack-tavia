const nodemailer = require('nodemailer');
const db = require("../models");
const config = require('../config/auth.config');
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

// Konfigurasi Nodemailer untuk Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

const generateVerificationLink = (token) => {
  return `http://localhost:3000/verify-email?token=${token}`;
};

const sendVerificationEmail = async (to, token) => {
  const mailOptions = {
    from: "tavia@gmail.com",
    to,
    subject: "Verifikasi Email",
    html: `<p>Klik link berikut untuk verifikasi email: <a href="${generateVerificationLink(token)}">Verifikasi Email</a></p>`
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log("Error sending email:", err);
    }
    console.log("Email sent:", info.response);
  });
};

const generateVerificationToken = () => {
  const payload = {
    type: "verification",
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token berlaku selama 1 jam
  };

  return jwt.sign(payload, config.secret);
};

const verificationToken = generateVerificationToken();
let emailUser = '';

exports.signup = async (req, res) => {
  const { nohp, email, password } = req.body;

  if (!nohp || !email) {
    return res.status(400).send({ message: "No HP dan Email harus diisi." });
  }

  try {
    const user = await User.create({
      nohp: nohp,
      email: email,
      password: bcrypt.hashSync(password, 8)
    });

    if (user) {
      emailUser = req.body.email
    }

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    if (token === verificationToken) {
      const user = await User.findOne({
        where: {
          email: emailUser
        }
      });

      if (user) {
        await user.update({ verified: true });
        return res.status(200).send({ success:true, message: "Akun sudah aktif" });
      }
    }
      return res.status(400).send({ message: "Token verifikasi tidak valid atau sudah digunakan." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, config.secret, {
    expiresIn: "30s", // 86400  24 jam
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, config.refreshSecret);
};

let refreshTokens = [];

exports.signin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email harus diisi." });
  }

  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    if (!user.verified) {
      return res.status(403).send({ success: false, message: "Akun belum diaktivasi. Silakan verifikasi email Anda." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.status(200).send({
      id: user.id,
      nohp: user.nohp,
      email: user.email,
      accessToken: token,
      refreshToken: refreshToken
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {

  const refreshToken = req.body.token;

  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }

  jwt.verify(refreshToken, config.refreshSecret, (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
}

// Forgot Password
const sendForgotPassword = async (to, refToken) => {
  const mailOptions = {
    from: "tavia@gmail.com",
    to,
    subject: "Ganti Password",
    html: `<p>Klik link berikut untuk mengganti password: <a href="http://localhost:3000/reset-password?refToken=${refToken}">Ganti Password</a></p>`
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log("Error sending email:", err);
    }
    console.log("Email sent:", info.response);
  });
};

let emailForgot = '';

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    if (user) {
      emailForgot = email;
      sendForgotPassword(email, verificationToken);
      return res.status(200).send({ message: "Email forgot password sudah terkirim" });
    } else {
      return res.status(400).send({ message: "Email tidak ditemukan" });
    }
    
  } catch (error) {
    return res.status(500).send({ message: err.message });
  }
}

let tokenForgot = '';

exports.verifyForgotPassword = async (req, res) => {
  const { refToken } = req.query;
  try {
    if (refToken === verificationToken) {
      tokenForgot = refToken;
      return res.status(200).send({ success:true, message: "silahkan ganti password" });
    }
      return res.status(400).send({ message: "Token verifikasi tidak valid atau sudah digunakan." });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: emailForgot
      }
    });

    if (user) {
      const newPass = await user.update({ password: bcrypt.hashSync(newPassword, 8) });
      if (newPass) {
        return res.status(200).send({ success:true, message: "Password berhasil diperbarui" });
      }
    } else {
      return res.status(400).send({ message: "User tidak ditemukan." });
    }
  } catch (error) {
    res.status(500).send({ message: err.message });
  }
}