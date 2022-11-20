import express from 'express';
import User from '../models/users.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/register', async function (req, res) {
  try {
    const { fullname, email, password: psw } = req.body;  
    const password = await bcrypt.hash(psw, 10);

    if (!fullname || !email || !password) return res.status(404).json({ message: '!fullname || !email || !password' });

    if (fullname.length < 3) return res.status(404).json({ message: 'fullname length < 3' });
    if (!isNaN(fullname)) return res.status(404).json({ message: '!isNaN(fullname)' });
    if (email.length < 5) return res.status(404).json({ message: 'email length < 3' });
    if (req.body.password.length < 8) return res.status(404).json({ message: 'password length < 8' });

    if (await User.findOne({ email: email })) return res.status(404).json({ message: '!user.email' });

    const data = new User({
      fullname,
      email,
      password,
    });
    data.save();

    return res.status(200).json(req.body);
  } catch (err) {
    return res.status(404).json({ message: `[${err.name}] ${err.message}` });
  }
});

router.post('/login', async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(404).json({ message: '!email || !password' })
   
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: '!user.email' });

    if (!bcrypt.compareSync(password, user.password)) return res.status(404).json({ message: '!req.body.password === user.password' });

    return res.status(200).json({
      fullname: user.fullname,
      email: user.email,
      userType: user.userType,
      createdDate: user.createdDate,
    });
  } catch (err) {
    return res.status(404).json({ message: `[${err.name}] ${err.message}` });
  }
});

router.post('/control', async function (req, res) {
  try {
    const { _id } = req.body;
    if (!_id) return res.status(404).json({ message: '!id' });

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: '!user.id' });

    return res.status(200).json({
      fullname: user.fullname,
      email: user.email,
      userType: user.userType,
      createdDate: user.createdDate,
    });
  } catch (err) {
    return res.status(404).json({ message: `[${err.name}] ${err.message}` });
  }
});

export default router;