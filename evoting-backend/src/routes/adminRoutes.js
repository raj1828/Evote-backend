import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/authMiddleware.js'
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUser = await User.findOne({
      username,
      isAdmin: true
    });

    if (!adminUser) {
      return res.status(404).json({ msg: "Admin user not found" });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: adminUser._id,
        isAdmin: adminUser.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;