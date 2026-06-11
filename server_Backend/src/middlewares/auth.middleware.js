import jwt from 'jsonwebtoken';

export default (req, res, next) => {

  const authHeader =
    req.headers.authorization;

  console.log(
    'AUTH HEADER:',
    authHeader
  );

  if (!authHeader) {

    return res.status(401).json({
      message: 'Chưa đăng nhập'
    });

  }

  const token =
    authHeader.split(' ')[1];

  console.log(
    'TOKEN:',
    token
  );

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(
      'DECODED:',
      decoded
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.log(
      'JWT ERROR:',
      error
    );

    return res.status(401).json({
      message: 'Token không hợp lệ',
      error: error.message
    });

  }

};