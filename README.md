# kin-node-server
A callback implementation of the [Kin ecosystem SDK for Node.js](https://github.com/kinecosystem/kin-sdk-node)


**Note:**, this will only work with pre-created accounts (you provide the private key of an on-boarded account)

## Usage
### Installation
```
npm install @hitwill/kin-node-server
```

### Initializing
Initialize once and use throughout your code
```javascript
    const isProduction = false;
    const isProduction = 'your seed of an existing account';
    var KinWrapper = require('./KinWrapper');
    var kin = new KinWrapper(seed, isProduction);
```

### Calling functions
## Synchronous functions
Just call synchronous functions defined in the [SDK](https://github.com/kinecosystem/kin-sdk-node) as follows:
```javascript
const whitelistedTransaction = kin.account.whitelistTransaction(clientTransaction);
```

Or

```javascript
const decodedTransaction = kin.client.decodeTransaction(encodedTransaction);
```


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