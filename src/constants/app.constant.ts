import * as env from 'env-var';

import dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  NATS_URL: env.get('NATS_URL').required().asString(),
});
