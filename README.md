# Hornest-Wallet
A simple(ongoing) wallet system built with NestJS,postgres and TypeORM

## Functionalities to be included
- Abilities for users to be able to save and withdraw money to using [Flutterwave](https://flutterwave.com/us/) payment gateway.
- User Card credentials a such as credit card number and [CVV](https://www.idfcfirstbank.com/cvv.html) are stored as encrypted cipher text in order for the system to be [PCI DSS compliant](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard)

To get started with this project clone the repo by running the command git clone https://github.com/E-wave112/Hornest-Wallet.git or downloading the zip file

In the root of the project run the following command

```
recommended
$ yarn
```

or
```
$ npm install
```
Start the development server (remember to put in the right environment variables) via the command

```
$ yarn start:dev
```

```
$ npm run start:dev
```

The API is also documented via the NestJs built-in [Open-API](https://swagger.io/specification/) specification