<!--
*** Template em https://github.com/othneildrew/Best-README-Template 
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/gerjunior/secret-friend">
    <img src="assets/gift.png" alt="Logo" width="100", height="100">
  </a>
  <h3 align="center">Secret Friend</h3>

  <p align="center">
    Who's mine?
    <br />
    <a href="https://github.com/gerjunior/secret-friend/issues">Report a Bug</a>
    ·
    <a href="https://github.com/gerjunior/secret-friend/issues">Request a Feature</a>
  </p>



</p>



<!-- TABLE OF CONTENTS -->

## Index

* [About the project](#about-the-project)
  * [Tools](#tools)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->
## About the project

After starting [GoStack](https://rocketseat.com.br/), I decided that I had to proof my acknowledments for myself by doing something that uses everything that I learned: frameworks, libs, concepts, language. I picked up a college task and turned it bigger, applying everything I knew.

### Tools

* [NodeJS](https://nodejs.org/en/)
* [Typescript](https://www.typescriptlang.org/)
* [Postgres](https://www.postgresql.org/)

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

You will probably need to install Docker. You can do this by clicking [here](https://www.docker.com/get-started).

### Installation

1. Clone the repo
```sh
git clone https://github.com/gerjunior/secret-friend
```
2. Go inside the api folder
```sh
cd api
```
3. Install packages
```sh
yarn install
```
4. Create a postgres instance in docker
```sh
docker run --name postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 postgres
```
5. Create a new database for the project and configure the connection. Name it "secret-friend"
   PS: You can use [DBeaver](https://dbeaver.io/) to create the database.

5. Create a new file inside the api folder named *.env*. Copy and paste the content of *.env.example* inside it.

6. Start the api
```sh
yarn dev:server
```
or
```
yarn start
```

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/gerjunior/secret-friend/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUIÇÕES -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- CONTATO -->

## Contact

* Project: [https://github.com/gerjunior/secret-friend](https://github.com/gerjunior/secret-friend)
* My GitHub: [https://github.com/gerjunior](https://github.com/gerjunior)
* LinkedIn: [https://www.linkedin.com/in/gerjunior/](https://www.linkedin.com/in/gerjunior/)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements
* [Docker](https://www.docker.com/)
* [Express](https://expressjs.com/pt-br/)
* [Linting](https://stackoverflow.com/questions/8503559/what-is-linting) | [EsLint](https://eslint.org/) 
* [ORM](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwibhdrHzOjpAhXLHLkGHYZ5BbUQwqsBMA16BAgKEAQ&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DsnOXxJa31GI&usg=AOvVaw0lVRdltJqZhaPZEnZ2dSET)
* [Typeorm](https://typeorm.io/#/)
* [Yarn](https://yarnpkg.com/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/gerjunior/secret-friend.svg?style=flat-square
[contributors-url]: https://github.com/gerjunior/secret-friend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/gerjunior/secret-friend.svg?style=flat-square
[forks-url]: https://github.com/gerjunior/secret-friend/network/members
[stars-shield]: https://img.shields.io/github/stars/gerjunior/secret-friend.svg?style=flat-square
[stars-url]: https://github.com/gerjunior/secret-friend/stargazers
[issues-shield]: https://img.shields.io/github/issues/gerjunior/secret-friend.svg?style=flat-square
[issues-url]: https://github.com/gerjunior/secret-friend/issues
[license-shield]: https://img.shields.io/github/license/gerjunior/secret-friend.svg?style=flat-square
[license-url]: https://github.com/gerjunior/secret-friend/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/gerjunior
