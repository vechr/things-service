import dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
  APP_PORT: process.env.APP_PORT || 3000,
})