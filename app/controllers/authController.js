const mongoose = require('mongoose');
const sendMail = require('../services/mailer');

const User = mongoose.model('User');

module.exports = {
  async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      if (!(await user.compareHash(password))) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      return res.json({
        user,
        token: user.generateToken(),
      });
    } catch (error) {
      return next(error);
    }
  },

  async signup(req, res, next) {
    try {
      const { email, username } = req.body;

      if (await User.findOne({ $or: [{ email }, { username }] })) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await User.create(req.body);

      /**
       * Pode tirar o await para agilizar a criação da conta do user, pois o Node vai
       * processar o envio do e-mail em background sem problemas.
       * */

      await sendMail({
        from: 'Maiko Silva <maikossamster@gmail.com>',
        to: user.email,
        subject: `Bem-vindo ao RocketTweeter, ${user.name}`,
        template: 'auth/register',
        context: {
          name: user.name,
          username: user.username,
        },
      });

      return res.json({
        user,
        token: user.generateToken(),
      });
    } catch (error) {
      return next(error);
    }
  },
};
