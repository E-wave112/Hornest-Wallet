# Hornest-Wallet
A simple wallet system built with NestJS, postgres and TypeORM

## Functionalities
- Abilities for users to be able to save and withdraw money to using the [Flutterwave](https://flutterwave.com/us/) payment gateway.
- User Card credentials such as credit-card numbers and [CVV](https://www.idfcfirstbank.com/cvv.html) are stored as encrypted ciphertexts in order for the system to be [PCI DSS compliant](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard)
- users can also check the current exchange rates for popular cryptocurrencies(BTC, ETH, DOGE, SHIB, SOL e.t.c) via our very own api : [bitfast](https://github.com/E-wave112/bitfast_2.0)

To get started with this project, clone the repo by running the command git clone https://github.com/E-wave112/Hornest-Wallet.git or downloading the zip file

In the root of the project run the following command

```bash
 yarn
```

or
```bash
 npm install
```
Start the development server (remember to put in the right environment variables) via the command

```bash
 yarn start:dev
```
or

```bash
 npm run start:dev
```

The API is also documented via [postman](https://documenter.getpostman.com/view/11690328/UVe9S9cc)  and the live url can be found [here](https://hornest-api.herokuapp.com/api/v1)

You can try out the transactions functionality for free using the cards credentials(Card Number, CVVs, expiry) in the documentation


### Containerizing the API
#### Build the initial docker image
```bash
docker-compose up --build
```
#### Running the Dev Docker container

To run the container, use the following command:

```bash
 docker-compose up
```

 - The server will be running on [localhost:5000](http://0.0.0.0:5000)

 - Find the Docker image on the cloud [here](https://hub.docker.com/repository/docker/ewave112/hornest)

 - A useful resource on how to push your docker image to [DockerHub](https://hub.docker.com)  can be found [here](https://ropenscilabs.github.io/r-docker-tutorial/04-Dockerhub.html)

## CONTRIBUTING TO HORNEST WALLET
#### While the hornest-wallet project is completely free to use and open source, here are a few things to note when making Pull Requests

- Ensure the PR is made to the ```dev``` branch so it can be reviewed before it gets merged to the main branch (we are currently looking to implement a CI/CD pipeline as soon as possible) so as to automate things and reduce room for human error
- The code architecture and design pattern for the PR should be consistent with the existing codebase

## Your Contributions are highly appreciated!
