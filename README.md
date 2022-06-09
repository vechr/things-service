<p align="center">
  <a href="" target="blank"><img src="./public/kreMES.svg" width="320" alt="kreMES Logo" /></a>
</p>

# Edit your `.env` file
There's PORT for this app, Your NATS URL, and Database things
```
APP_PORT=3000
NATS_URL=nats://localhost:4222
DB_URL="postgresql://kreMES:123@localhost:5432/things-db?schema=public"
```

# Running Thing Service
```bash
yarn install
yarn prisma:sync
yarn db:migrate
yarn db:studio
yarn watch
```

# Access Open API (Swagger UI)
For creating metadata you can create through this Open API
```
http://localhost:3000/api/things
```