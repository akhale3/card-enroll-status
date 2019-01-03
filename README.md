# card-enroll-status
Add a card and turn it off

## Prerequisites
1. Linux-based machine
2. Node v8+

## Installation
```
git clone git@github.com:akhale3/card-enroll-status.git
cd card-enroll-status
npm install
```

## Usage
1. Add a CSV file in the current directory and name it `cards.csv`.
2. The contents of the CSV file must be card numbers, with no leading zeroes, one number per line.
```
8888880000000000
8888880000000001
8888880000000002
8888880000000003
```
3. Run the command below.
```shell
ADD_CARD_URL='https://<API Listener URL>/api/v1/card/addCardSecure' SET_ENABLED_URL='https://<Central URL>/api/v1/cardSettings/setEnabled' AUTH_TOKEN='<App Permission Token>' node index.js
```
