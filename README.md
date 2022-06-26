<h1 align="center">Discord Clone built with React and Node js</h1>

![App screenshot](https://res.cloudinary.com/arjoban-main-cloud/image/upload/v1656072439/discord_clone/full-screnn-with-members_vbdbjt.png)

<h3>
  Discord Clone's API is written in TypeScript and using TypeORM and it's frontend is written in modern React, only functional 
  components with hooks and frontend's code is splitted using Suspense and lazy loading techniques.
</h3>

## Features

- Fully responsive app with client side code splitting
- Login/ Register
- Create Public or Private Servers
- Join public servers either while exploring or with INVITE URL's
- While Private servers can only be joined with INVITE URL's
- Create Channels (For now text channels, Audio channels will be added in future versions)
- Realtime chat in channels with different type of messages(TEXT, IMAGE, VIDEO, AUDIO, FILE)
- Server Members roles with different access level
- Edit server details, server member roles
- Kick members, transfer server ownership
- Leave or Delete Servers

## Backend Core Packages

- [Express Js](https://expressjs.com/): For server and api
- [PostgreSql](https://www.postgresql.org/): Database used
- [TypeOrm](https://typeorm.io/): Database ORM
- [Socket-io](https://socket.io/): For realtime connections and chat
- [Multer](https://github.com/expressjs/multer): For handling file uploads
- [Cloudinary](https://cloudinary.com/): For uploading file uploads
- [Redis](https://redis.com/): For user token session management

## Frontend Core Packages

- [React js](https://reactjs.org/): Client side rendering
- [React Router DOM V6](https://reactrouter.com/): For nested routing for servers and channels
- [Redux](https://redux.js.org/): For Client Global state management
- [Axios](https://axios-http.com/): For Data fetching on client
- [Socket-io-client](https://socket.io/docs/v4/client-api/): Socket io client to connect with server for realtine chat and notifications
- [Material Ui V5](https://mui.com/material-ui/getting-started/overview/): Ui library
- [Styled Components](https://styled-components.com/): For styling the app

## Setting up development environment

- Install [postgreSQL](https://www.postgresql.org/) if you don't have it already and create a database named discord_clone.
- Install redis if not already, or can use Redis cloud instance like [Redis labs](https://redis.com/) or [Upstash](https://upstash.com/)
- Create an empty `.env` file in root folder, copy [.env.example](.env.example) contents into it, and fill in your values.
- `npm run install-dependencies`
- `npm run serve` on root folder
- `cd client && npm start`
- Server should be running now at `http://localhost:5000`
- Client should be running now at `http://localhost:3000`

## To Run production version on your device

- In root folder execute `npm run build`
- Then execute `cd client && npm run build`
- In .env folder add `NODE_ENV` with value of `production`.
- Do not forget to delete `NODE_ENV` variable from .env file to run development server correctly afterwards.
- From your root folder, execute command `npm start`
- Now your Production version of app should be running at `http://localhost:5000`

## Following features would be added in future

- [ ] Audio/Video Channel Support
- [ ] Edit Messages

## What's Missing?

- User to User relationships and personal chat
- Ban Users from servers
- Private Channels
- Dynamic server member roles
- Message reactions
- Message threads

## UI Snapshots

### Create/Join Server Modal

![Create/Join Server Modal](https://res.cloudinary.com/arjoban-main-cloud/image/upload/v1656081715/discord_clone/create-or-join-server_yc11fu.png)

### Update Server Settings

![Update Server Settings](https://res.cloudinary.com/arjoban-main-cloud/image/upload/v1656081727/discord_clone/update-server-settings_l4ah5o.png)

### Join Server with Invite URL

![Join server with invite url](https://res.cloudinary.com/arjoban-main-cloud/image/upload/v1656081736/discord_clone/jon-server-with-url_kh3otz.png)

### Explore Public Servers

![Explore Public Servers](https://res.cloudinary.com/arjoban-main-cloud/image/upload/v1656265431/discord_clone/Screenshot_2022-06-26_230447_fyybal.png)
