export default {
  jwt: {
    secret: process.env.jwtSecret || 'default',
    expiresIn: process.env.jwtExpiresIn || '1d',
  },
};
