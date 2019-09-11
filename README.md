# kin-node-callback
Wrapper with callbacks for the [Kin ecosystem SDK for Node.js](https://github.com/kinecosystem/kin-sdk-node)


**Note 1:** - this will only work with pre-created accounts (you provide the private key of an on-boarded account).

**Note 2:** - this uses [channels](https://docs.kin.org/nodejs/sdk#channels) to increase performance, so  you need to make sure that only a single instance of a KinAccount is initialized with multiple channel accounts.

**Note 3:** - You can find a fully implemented version of this code [here](https://github.com/hitwill/kin-nodejs-server) with instructions of how to implement it yourself on [heroku](https://heroku.com).

# Usage
## Installation
```
npm install kin-node-callback
```

## Initializing
Initialize once and use throughout your code
```javascript
const isProduction = false;
const appID = 'appID';
const KinWrapper = require('./KinWrapper');

//NOTE: store your seed in an environment variable! Below is just an example
const seed = 'SD5A7NFIWBZFMVNH73IORNWEGLEL6FTEHQD6N2HDJEM6RC5UZCIH7YK6';
const salt = 'SAQDKPXW2XC5SCNEADTEH2PHYHP74RWTCJ4MOK573RZINXI5HYIU4XK3';


var kin = new KinWrapper(seed, salt,isProduction,appID);
console.log(kin.account.publicAddress);

kin.sendKin('GC7LPGWEPTC47ENOCWC6B57FT6M6MBHK2ZAKWSAUISQFAEETMSWSUNNI', 10, 'test send', callback);

function callback(err, data) {
    console.log(data);
}
```

## First use
Before calling any functions, you will need to create and fund channels once. This creates 100 channels on Kin's blockchain that the wrapper will use. After this one time creation, you can comment out the code. Create the channels as follows:

```javascript
kin.CreateChannels(callback);

```


# Calling functions
## Synchronous functions
Just call synchronous functions defined in the [SDK](https://github.com/kinecosystem/kin-sdk-node) as follows:
```javascript
const address = kin.account.publicAddress;
```

Or


```javascript
const whitelistedTransaction = kin.account.whitelistTransaction(clientTransaction);
```

Or

```javascript
const decodedTransaction = kin.client.decodeTransaction(encodedTransaction);
```

etc


## Asynchronous functions
Check if an account exists
```javascript
kin.isAccountExisting(address, (err, exists) => {
    if (!err) {
        console.log(exists);
    }
});
```

Get the minimum fee per transaction
```javascript
kin.getMinimumFee((err, fee) => {
    if (!err) {
        console.log(fee);
    }
});
```

Create an account on the blockchain
```javascript
kin.createAccount(address, startingBalance, memoText, (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

Get the balance on an account
```javascript
kin.getAccountBalance(address, (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```


Get the data on an account
```javascript
kin.getAccountData(address, (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

Send Kin to a destination
```javascript
kin.sendKin(destination, amount, memoText,  (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

Get the data on a transaction
```javascript
kin.getTransactionData(transactionId, (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

Fund an account with the friendbot (test network)
```javascript
kin.friendbot(address, ammount,  (err, transactionId) => {
    if (!err) {
        console.log(transactionId);
    }
});
```

## Listening for Kin Payments
These methods can be used to listening for Kin payment that an account or multiple accounts are sending or receiving.

It is possible to monitor multiple accounts using `createPaymentListener`. This function will continuously get data about **all** accounts on the blockchain, and you can specify which accounts you want to monitor.

```javascript
const paymentListener = kin.client.createPaymentListener({
        onPayment: payment => {
            console.log(payment);
        },
        addresses: ['address1', 'address2']
    });
```

You can freely add accounts to this monitor or remove them:

```javascript
paymentListener.addAddress('address3');
paymentListener.removeAddress('address1');
```

### Stopping a Monitor
When you are done monitoring, stop the monitor to terminate the connection to the blockchain.

```javascript
paymentListener.close();
```
