import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = 'your_secret_key';

const register = async ({ full_name, email, password, phone, address }) => {
  // check email tồn tại (tuỳ bạn)
  const existing = await AuthModel.findByEmail(email);
  if (existing) {
    const err = new Error('Email đã tồn tại');
    err.status = 400;
    throw err;
  }

  // hash password
  const hash = await bcrypt.hash(password, 10);

  // create user
  const user = await AuthModel.create({
    full_name,
    email,
    password: hash,
    phone,
    address,
  });

  // 🔥 tạo token luôn sau khi register
  const token = jwt.sign(
    {
      customer_id: user.customer_id,
      email: user.email,
      role: user.role || 'user',
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    customer: {
      customer_id: user.customer_id,
      full_name: user.full_name,
      email: user.email,
      role: user.role || 'user',
    },
  };
};

export default { register };