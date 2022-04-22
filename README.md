<p align="center">
  <a href="https://github.com/viniciusgugelmin/iam-up">
    <img src="info/readme.png" alt="readme-logo" width="80" height="80">
  </a>

  <h3 align="center">
    iam-up
  </h3>
  <p align="center">
    Identity Access Management - UP
    <br />
    <a href="https://github.com/viniciusgugelmin/iam-up"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/viniciusgugelmin/iam-up/issues">Report Bug</a>
    ·
    <a href="https://github.com/viniciusgugelmin/iam-up/issues">Request Feature</a>
  </p>
</p>

<details open="open">
  <summary><h2 style="display: inline-block">Abstract</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

Web application to manage users access to the system.

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Nextjs](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

## Roadmap

See the [open issues](https://github.com/viniciusgugelmin/iam-up/issues) for a list of proposed features (and known
issues).

### Usage

```bash
$ git clone https://github.com/viniciusgugelmin/iam-up

$ cd iam-up

$ npm install

$ npm run dev
```

Create a `.env.local` file with the following content:

```
NEXT_PUBLIC_APP_NAME="Go Drink"
NEXT_PUBLIC_API_URL="" // API URL - http://localhost:3000/api

NEXT_PUBLIC_MONGO_URI="" // MongoDB URI - mongodb://localhost:27017
NEXT_PUBLIC_MONGO_DB="" // MongoDB DB - go-drink

NEXT_PUBLIC_SESSION_SECRET="" // Session Secret - "go-drink-secret"
NEXT_PUBLIC_SESSION_ADMIN_PASSWORD="" // Admin Password - "admin"
```

Connect to MongoDB.

API:

```
- GET /api/user
  - Route to get the user authenticated in the session
- POST /api/user (not authenticated)
  - Route to login the user
- GET /api/users
  - Route to get all users
- GET /api/users/:id
  - Route to get a user by id
- PUT /api/users/:id
  - Route to update a user by id
- POST /api/users
  - Route to create a new user
- DELETE /api/users/:id
  - Route to delete a user by id
- GET /api/roles
  - Route to get all roles
```

Routes:

```
- /
  - Base route to select to login or register
- /?page=login
  - Route to login
- /?page=signup
  - Route to register
- /home
  - Logged in base route

```

## Contributing

Any contributions you make are **greatly appreciated**.

1. Clone the Project
2. Create your Feature Branch (`git checkout -b feature/<featureName>`)
3. Commit your Changes (`git commit -m '<Description of the feature added>'`)
4. Push to the Branch (`git push origin feature/<featureName>`)
5. Open a Pull Request

## Contact

Vinícius Kruchelski Gugelmin - vinigugelmin@gmail.com

Lucas Rodrigues Leite

Gabriel Zanin

Carlos Neres

Project Link: [https://github.com/viniciusgugelmin/iam-up](https://github.com/viniciusgugelmin/iam-up)
