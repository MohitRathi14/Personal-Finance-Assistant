import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    // Try user secret first, then admin secret
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.USER_SECRET_KEY);
    } catch (err) {
      decoded = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};