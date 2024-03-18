# NextJS with Docker

This project is started with NextJS, Postgres for DB, Tailwind, and Prisma as an ORM.

*Note: You have to use node version equal or greater than 18.17.0*.

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

#### Brief Overview

I started with an `init.sql` script to create the database, that would be immediatly run by the docker container on create, but quickly noticed I would need a way to query the database. So I decided to use Prisma, and created the models in it, which gave me a migration sql file.

In the seed script I ran into many issues with Prisma regarding uniquness of the data and with the relational queries, so I decided to go step by step - use the `*.txt` files generated by the analyzing script to populate the tables first, then run more checks and execute the relational queries.
I did not do the requests is parallel (Promise.all) because I ran into unique constraint violations. This happened because while the promises were put in an array, they were not saved to the db yet, so the checks whether there is an input with the same values in the db failed.

I also overrode the `tailwind.config.ts` file for the container screens. Since this is not responsive design, I set the value for all screens to be `1280px`, to avoid the container shrinking on me by default. Tailwind shrinks the container - sets a `max-width` value to the value of the next breakpoint. This way I can utilize the full width of the screen, and set padding accordingly. On screens bigger than `1280px`, I decided to keep the Tailwind behavior because the UI/UX is better for the user.

I've created an api endpoint `/studies` with an optional `page` that uses `react-query` request and response. It queries the db with prisma, and only gets the studies with the intervention category, and it includes the appropriate relations. In the `Table.tsx` component I perform the `GET` request using `axios` and display the results in the table. I also handle the loading and error states of the component.
The summary is displayed only when the chevron button is clicked.
