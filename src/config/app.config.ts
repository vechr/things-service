import * as env from 'env-var';

import dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  COOKIE_SAME_SITE: env.get('COOKIE_SAME_SITE').default('strict').asString(), // lax, strict, none
  COOKIE_SECURE: env.get('COOKIE_SECURE').default('true').asBoolStrict(),
  COOKIE_HTTP_ONLY: env.get('COOKIE_HTTP_ONLY').default('true').asBoolStrict(),
  NATS_URL: env.get('NATS_URL').required().asString(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  ECRYPTED_SECRET: env.get('ECRYPTED_SECRET').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('3d').asString(),
  JWT_REFRESH_EXPIRES_IN: env
    .get('JWT_REFRESH_EXPIRES_IN')
    .default('30d')
    .asString(),
  NATS_SERVICE: 'NATS_SERVICE',
  AUDIT_EVENT: {
    CREATED: 'audit.created',
    UPDATED: 'audit.updated',
    DELETED: 'audit.deleted',
    UPSERT: 'audit.upsert',
  },
  NATS_CA: env.get('NATS_CA').required().asString(),
  NATS_KEY: env.get('NATS_KEY').required().asString(),
  NATS_CERT: env.get('NATS_CERT').required().asString(),
  APP_NAME: env.get('APP_NAME').default('things-service').asString(),
  LOKI_HOST: env.get('LOKI_HOST').required().asString(),
  LOKI_USERNAME: env.get('LOKI_USERNAME').default('').asString(),
  LOKI_PASSWORD: env.get('LOKI_PASSWORD').default('').asString(),
  OTLP_HTTP_URL: env.get('OTLP_HTTP_URL').asString(),
  REDIS_URL: env.get('REDIS_URL').asString(),
  REDIS_TTL: env.get('REDIS_TTL').default(300).asInt(),
});
