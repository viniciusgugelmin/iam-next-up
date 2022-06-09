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
NEXT_PUBLIC_MONGO_DB_TEST="" // MongoDB DB - go-drink-test

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
- GET /api/products
  - Route to get all products
- GET /api/products/:id
  - Route to get a product by id
- PUT /api/products/:id
  - Route to update a product by id
- POST /api/products
  - Route to create a new product
- DELETE /api/products/:id
  - Route to delete a product by id
- GET /api/products/categories
  - Route to get all categories
- GET /api/products/categories/:id
  - Route to get a category by id
- PUT /api/products/categories/:id
  - Route to update a category by id
- POST /api/products/categories
  - Route to create a new category
- DELETE /api/products/categories/:id
  - Route to delete a category by id
- GET /api/storage
  - Route to get all storage
 - GET /api/entries
  - Route to get all entries
- POST /api/entries
  - Route to create a new entry and add it to the storage
- DELETE /api/entries/:id
  - Route to delete an entry by id and remove it from the storage
- GET /api/products-for-sale
  - Route to get all products for sale
- POST /api/products-for-sale
  - Route to create a new product for sale
- DELETE /api/products-for-sale/:id
  - Route to delete a product for sale by id
- GET /api/customers
  - Route to get all customers
- POST /api/customers
  - Route to create a new customer
- PUT /api/customers/:id
  - Route to update a customer by id
- DELETE /api/customers/:id
  - Route to delete a customer by id
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
- /home/users/list
  - Route to list all users
- /home/users/form
  - Route to create a new user
- /home/users/form/:userId
  - Route to update a user by id
- /home/roles/list
  - Route to list all roles
- /home/products/list
  - Route to list all products
- /home/products/form
  - Route to create a new product
- /home/products/form/:productId
  - Route to update a product by id
- /home/products/categories/list
  - Route to list all categories
- /home/products/categories/form
  - Route to create a new category
- /home/products/categories/form/:categoryId
  - Route to update a category by id
- /home/storage/list
  - Route to list all storage
- /home/entries/list
  - Route to list all entries
- /home/entries/form
  - Route to create a new entry and add it to the storage
- /home/products-for-sale/list
  - Route to list all products for sale
- /home/products-for-sale/form
  - Route to create a new product for sale
- /home/customers/list
  - Route to list all customers
- /home/customers/form
  - Route to create a new customer
- /home/customers/form/:customerId
  - Route to update a customer by id
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
