import JWT from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    res.status(401).send({
      message: 'Authorization failed',
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = JWT.verify(token, process.env.SECRET_KEY);
    req.user = { userId: payload.userId };

    next();
  } catch (err) {
    res.status(401).send({
      message: 'Authorization failed',
    });
  }
};
export default userAuth;
