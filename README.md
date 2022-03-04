# Hornest-Wallet
A simple wallet system built with NestJS,postgres and TypeORM

## Functionalities
- Abilities for users to be able to save and withdraw money to using the [Flutterwave](https://flutterwave.com/us/) payment gateway.
- User Card credentials such as credit-card numbers and [CVV](https://www.idfcfirstbank.com/cvv.html) are stored as encrypted ciphertexts in order for the system to be [PCI DSS compliant](https://en.wikipedia.org/wiki/Payment_Card_Industry_Data_Security_Standard)
- users can also check the current exchange rates for popular cryptocurrencies(BTC, ETH, DOGE, SHIB, SOL e.t.c) via our very own api : [bitfast](https://github.com/E-wave112/bitfast_2.0)

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
or

```
$ npm run start:dev
```

The API is also documented via [postman](https://documenter.getpostman.com/view/11690328/UVe9S9cc)  and the live url can be found [here](https://hornest-api.herokuapp.com/api/v1)

You can try out the transactions functionality for free using the cards credentials(Card Number, CVVs, expiry) in the documentation
