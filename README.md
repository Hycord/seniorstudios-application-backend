# Premier Studios Backend Application

### a RESTful API for a simple task management system

## Tech Stack

- Language - Typescript
- Database - MariaDB
- Database ORM - Prisma
- Development/Deployment - Docker
- Version Control - Git via [Github](https://github.com/hycord/premierstudios-application-backend)

## Core Functionality

- User Authentication
  - [x] Registration
  - [x] Login
  - [x] Logout
- Task Management
  - [x] Create
  - [x] Read
  - [x] Update
  - [x] Delete
- [x] Must support linking User -> Task in a one-to-many relationship

## Required Endpoints

| **METHOD** | **PATH**         |
| ---------- | ---------------- |
| **POST**   | /auth/register   |
| **POST**   | /auth/login      |
| **POST**   | /auth/logout     |
| **POST**   | /tasks           |
| **PUT**    | /tasks/:id       |
| **DELETE** | /tasks/:id       |
| **GET**    | /tasks           |
| **GET**    | /tasks/:id       |
| **GET**    | /users           |
| **GET**    | /users/:id/tasks |

## Required Data Models:

### User

- id
- username
- email
- password (Hashed) `This is handled automatically via /src/utils/database.ts`

### Task

- id
- title
- description
- status
- created_at
- updated_at
- user_id (assigned to)

## Setup Instructions

### Local Development

To run the project locally, you will need to do the following:

- Have the LTS Node.js version available
- Have docker available (if using)

1. Create a MariaDB server that you have access to. Doesn't matter where or how just make sure you can push to a specified db
2. Copy .env.example -> .env and fill in the values as needed (Please replace the JWT secret!)
3. run `npm install`
4. run `npm run init`
5. run `npm run dev` and you will see messages in the console instructing you as to the port you have selected. (Go [here](https://localhost:3000/api-docs) to view API docs once the project is running locally)

### Docker Deployment

To deploy the project locally with docker you will still need to follow steps 1-2 of "Local Development" however you should just be able to type "docker build . -t backend" to build the project and "docker run backed" to run it once you've configured your database settings appropriately.

You can also use "docker compose up" to start both redis and mariadb locally then "npm run build && npm run start" or "npm run dev" after configuring environment variables-

## API Documentation

Full API documentation is available via swagger.
Wherever you can reach the API you can view the docs under <host>/api-docs where the swagger interface will show up

## Design Decisions

Although there were many options for each of the tools I chose to use when completing this project I have a reason for using each of them, although that's not to say they don't come with their own set of challenges.

One of the early challenges I ran into was actually with getting Swagger to run properly, as I had never used swagger before. I had to scaffold out the project as well as learn Swagger notation at the same time.

One of my most elegant solutions to a problem actually has to do with the hashing of passwords when placing them into the database.
Instead of having a shared method which I call prior to passing my data into the database, I actually extended the base Prisma client to inject the hashing code before the data is sent to the database allowing me to pass raw passwords to the database write calls and recieve hashed passwords in the database from wherever I chose to write to the database from.

> Small note: I place "return res.status(500).send();" at the end of most handler functions for 2 reasons:
>
> 1. Garunteed catch all. If I forget something it won't just hang
> 2. Intellisense grays it out when there is no valid path to reach it so once it is grayed out I know I've covered all of the (type-based) edge cases.

## Bonus Features

### Filtering

- Any text field (I.E. Username, Title, Description) can used to filter and sort results.
- The following rules are applied:

"The quick brown fox jumps over the lazy dog"
Here's how the following queries would match that text:

| Query          | Match? | Description                                                   |
| -------------- | ------ | ------------------------------------------------------------- |
| `+fox +dog`    | Yes    | The text contains 'fox' and 'dog'                             |
| `+dog +fox`    | Yes    | The text contains 'dog' and 'fox'                             |
| `+dog -cat`    | Yes    | The text contains 'dog' but not 'cat'                         |
| `-cat`         | No     | The minus operator cannot be used on its own (see note below) |
| `fox dog`      | Yes    | The text contains 'fox' or 'dog'                              |
| `quic*`        | Yes    | The text contains a word starting with 'quic'                 |
| `quick fox @2` | Yes    | 'fox' starts within a 2 word distance of 'quick'              |
| `fox dog @2`   | No     | 'dog' does not start within a 2 word distance of 'fox'        |
| `"jumps over"` | Yes    | The text contains the whole phrase 'jumps over'               |

> Note: The `-` operator acts only to exclude rows that are otherwise matched by other search terms. Thus, a boolean-mode search that contains only terms preceded by `-` returns an empty result. It does not return “all rows except those containing any of the excluded terms.”

- We also support >, < and ~ operators for altering the ranking order of search results. As an example, consider the following two records:

1. "The quick brown fox jumps over the lazy dog"
2. "The quick brown fox jumps over the lazy cat"

| Query             | Result                   | Description                                                                                             |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------------------------- |
| `fox ~cat`        | Return 1. first, then 2. | Return all records containing 'fox', but rank records containing 'cat' lower                            |
| `fox (<cat >dog)` | Return 1. first, then 2. | Return all records containing 'fox', but rank records containing 'cat' lower than rows containing 'dog' |

### Rate Limiting

All routes have a rate limit of 30 requests/60 seconds; Redis handles all rate limits.

The keys for rate limits are as follows:

`rate-limit::{channel}::{client IP}`

the global rate limit falls under the "global" channel and is the first middleware that is applied.

The helper "CreateRateLimit" can be used to apply other rate-limit channels as middleware.

You just call app.use(CreateRateLimit(channel: string, rate: number, ttl: number)) to implement a rate limit.

> Note: To show the extensibility of this system, the `POST /auth/login` route has a rate limit of 1 request per 600 seconds (10 minutes).
> There is no functional reason for this, just to show the ease at which this can be implemented
