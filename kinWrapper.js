const KinClient = require('@kinecosystem/kin-sdk-node').KinClient;
const Environment = require('@kinecosystem/kin-sdk-node').Environment;



function KinWrapper(seed, production, appId) {
    /**
    * @param {String} seed - private key of your account
    * @param {Boolean} production - true for production environment
    * @param {String} appId - unique app id provided by the Kin foundation
    */

    let environment;

    //Safety in case user forgets 'new' keyword
    if (!(this instanceof KinWrapper)) {
        return new KinWrapper(seed);
    }

    //this can only work with a seed
    if (typeof seed === 'undefined') {
        throw new Error('seed not defined when instantiating object');
    }

    if (typeof appId === 'undefined') {
        appId = ''; //will default to anon on the blockchain
    }

    if (!production) {
        environment = Environment.Testnet;
    } else {
        environment = Environment.Production;
    }

    this.client = new KinClient(environment);
    this.account = getAccount(seed, this.client, appId);
    this.fee = 100; //todo: fetch this dynamically

}

KinWrapper.prototype.sendKin = function (destination, amount, memoText, callBack) {
    /**
    * Send Kin to an account
    * @param {String} destination - address of account
    * @param {Number} amount - amount to send
    * @param {String} memoText - optional memo
    * @param {Function} callBack - callback (err, bool)
    */

    if (!isFunction(callBack)) callBack = function () { };
    this.account.buildSendKin({
        address: destination,
        amount: amount,
        fee: this.fee,
        memoText: memoText
    }).then(builder => {
        //use the builder to submit the transaction to the blockchain
        this.account.submitTransaction(builder).then(transactionId => {
            callBack(null, transactionId);
        }).catch((err) => {
            callBack(err);
        });
    });
};


KinWrapper.prototype.friendbot = function (address, amount, callBack) {
    /**
    *Return the transaction details of a transactionId
    * @param {String} transactionId - transactionId of account
    * @param {Function} callBack - callback (err, number)
    */
    if (!isFunction(callBack)) callBack = function () { };

    this.client.friendbot({
        address: address,
        amount: amount
    }).then(transactionId => {
        callBack(null, transactionId);
    }).catch((err) => {
        callBack(err);
    });
};



KinWrapper.prototype.getTransactionData = function (transactionId, callBack) {
    /**
    *Return the transaction details of a transactionId
    * @param {String} transactionId - transactionId of account
    * @param {Function} callBack - callback (err, number)
    */
    if (!isFunction(callBack)) callBack = function () { };

    this.client.getTransactionData(transactionId)
        .then(transactionData => {
            callBack(null, transactionData);
        }).catch((err) => {
            callBack(err);
        });
};



KinWrapper.prototype.getAccountData = function (address, callBack) {
    /**
    *Return the account balance
    * @param {String} address - address of account
    * @param {Function} callBack - callback (err, number)
    */
    if (!isFunction(callBack)) callBack = function () { };

    this.client.getAccountData(address)
        .then(accountData => {
            callBack(null, accountData);
        }).catch((err) => {
            callBack(err);
        });
};



KinWrapper.prototype.getAccountBalance = function (address, callBack) {
    /**
    *Return the account balance
    * @param {String} address - address of account
    * @param {Function} callBack - callback (err, number)
    */
    if (!isFunction(callBack)) callBack = function () { };

    this.client.getAccountBalance(address)
        .then(balance => {
            callBack(null, balance);
        }).catch((err) => {
            callBack(err);
        });
};


KinWrapper.prototype.getMinimumFee = function (callBack) {
    /**
    *Return the minimum fee
    * @param {Function} callBack - callback (err, number)
    */
    if (!isFunction(callBack)) callBack = function () { };
    this.client.getMinimumFee()
        .then(minFee => {
            callBack(null, minFee);
        }).catch((err) => {
            callBack(err);
        });
};


KinWrapper.prototype.isAccountExisting = function (address, callBack) {
    /**
    *Return if an account exists on the blockchain 
    * @param {String} address - address of account
    * @param {Function} callBack - callback (err, bool)
    */
    if (!isFunction(callBack)) callBack = function () { };

    this.client.isAccountExisting(address)
        .then(exist => {
            callBack(null, exist);
        }).catch((err) => {
            callBack(err);
        });
};



KinWrapper.prototype.createAccount = function (address, startingBalance, memoText, callBack) {
    /**
    * Create an account on the blockchain
    * @param {String} address - address of account
    * @param {Number} startingBalance - starting balance of account
    * @param {String} memoText - optional memo
    * @param {Function} callBack - callback (err, bool)
    */
    if (!isFunction(callBack)) callBack = function () { };

    if (typeof memoText === 'undefined') memoText = '';
    if (memoText.length > 21) callback('memo too long - shorten to 21 characters:' + memoText);

    this.account.buildCreateAccount({
        address: address,
        startingBalance: startingBalance,
        fee: this.fee,
        memoText: memoText //a text memo can also be added; memos cannot exceed 21 characters
    }).then(builder => {
        this.account.submitTransaction(builder).then(transactionId => {
            callBack(null, transactionId);
        }).catch((err) => {
            callBack(err);
        });
    });
};


//helper functions below
function getAccount(seed, client, appId) {
    let account = client.createKinAccount({
        seed: seed,
        appId: appId
    });
    return (account);
}

function isFunction(possibleFunction) {
    return typeof (possibleFunction) === typeof (Function);
}





module.exports = KinWrapper;
