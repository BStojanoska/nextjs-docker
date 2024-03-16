# NextJS with Docker

This project is started with NextJS, Postgres for DB, Tailwind, and Prisma as an ORM.

#### Setup

Copy the `.env.example` to an `.env` file and set the variables (example below):
```
POSTGRES_USER=user
POSTGRES_PASSWORD=password
PGADMIN_DEFAULT_EMAIL=secret@email.com
PGADMIN_DEFAULT_PASSWORD=123456
DATABASE_URL="postgresql://user:password@localhost:5432/nextapp_dev"
```

Clone the repository, and then in the terminal run:
```
$ docker compose build
```

Followed by:
```
$ docker compose up
```

There is an `analyzeJson.js` file in `/scrips/analyzeJson.js` that I used to analyze the json data provided in the same location.
That script gives me more information about how should I structure my database.
It also outputs `.txt` files that contain data to seed several tables.

If you would like to rerun that script, you can do so by:
```
$ node scripts/analyzeJson.js
```

Then we would need to run the migrations with the command:
```
$ npx prisma migrate dev
```

And then seed it with:
```
$ npm run seed
```

*Note: You will need ts-node to run the script above, but your friendly terminal will probably ask you to install it.*
