import { check, validationResult } from 'express-validator';

export const joinRequest = async (req, res, next) => {
  try {
    await check('password').isString().run(req);
    await check('email').isEmail().run(req);
    await check('name').isString().run(req);

    const error = validationResult(req);
    if (!error.isEmpty()) {
      error.throw();
    }
    console.log(req.body.password);
    next();
  } catch (err) {
    res.status(400);
    res.send(err.mapped());
  }
};
