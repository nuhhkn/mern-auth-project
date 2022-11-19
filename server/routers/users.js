import express from 'express';
import User from '../models/users.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/register', async function (req, res) {
   const fullname = req.body.fullname,
      email = req.body.email,
      password = await bcrypt.hash(`${req.body.password}`, 10);

   if (fullname.length < 3)
      return res.status(404).json({ message: 'fullname length < 3' });
   if (!isNaN(fullname)) return res.status(404).json({ message: '!isNaN(fullname)' });
   if (email.length < 3) return res.status(404).json({ message: 'email length < 3' });
   if (req.body.password.length < 8)
      return res.status(404).json({ message: 'password length < 8' });

   if (await User.findOne({ email: email }))
      return res.status(404).json({ message: 'email used' });

   const data = new User({
      fullname,
      email,
      password,
   });
   data.save();

   return res.status(200).json(req.body);
});

router.post('/login', async function (req, res) {
   const email = req.body.email,
      password = req.body.password;
   
   const user = await User.findOne({ email });
   if (!user) return res.status(404).json({ message: 'email not used' });

   if (!bcrypt.compareSync(password, user.password))
      return res.status(404).json({ message: 'password incorrect' });

   return res.status(200).json(user);
});

router.post('/userControl', async function (req, res) {
   const _id = req.body.id;

   const user = await User.findById(_id);
   if (!user) return res.status(404).json({ message: 'id not found' });

   return res.status(200).json(user);
})

export default router;