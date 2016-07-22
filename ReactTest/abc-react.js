
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { NativeModules } from 'react-native';
import { NativeAppEventEmitter } from 'react-native';

var subscription = NativeAppEventEmitter.addListener(
  'abcAccountWalletLoaded', (wallet) => console.log(wallet.uuid)

);

var AirbitzCoreRCT = NativeModules.AirbitzCoreRCT;

class ABCError {
  constructor(code, message) {
    this.code = code
    this.message = message
    console.log("ABCError:" + code + ": " + message)

  }
}

function makeABCError(rcterror) {
  var code = rcterror['code'].replace("EABCERRORDOMAIN","")
  var err = new ABCError(code, rcterror['message'])
  return err
}

/**
 * ABCWallet Class
 */
class ABCTransaction {
  constructor(wallet, obj) {
    this.wallet = wallet
    for (var prop in obj)
      this[prop] = obj[prop];
  }

}

/**
 * ABCWallet Class
 */
class ABCWallet {
  constructor(account, obj) {
    this.account = account
    for (var prop in obj)
      this[prop] = obj[prop];
  }

  getTransactions(complete, error) {
    AirbitzCoreRCT.getTransactions((transactions) => {
      var txs = JSON.parse(transactions);

      for (i = 0; i < txs.length; i++) {
        txsReturn[i] = new ABCTransaction(this, txs[i])
      }

      complete(txsReturn)
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }
}

/**
 * ABCAccount Class
 */
class ABCAccount {
  constructor(name) {
    this.name = name
  }

  /**
   * logout
   * @param complete
   */
  logout (complete) {
    AirbitzCoreRCT.logout(() => {
      complete()
    })

  }

  /**
   * changePassword
   * @param password
   * @param complete
   * @param error
   */
  changePassword(password, complete, error) {
    AirbitzCoreRCT.changePassword(password, (response) => {
      complete()
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }

  /**
   * changePIN
   * @param pin
   * @param complete
   * @param error
   */
  changePIN(pin, complete, error) {
    AirbitzCoreRCT.changePIN(pin, (error, response) => {
      complete()
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }

  /**
   * checkPassword
   * @param password
   * @param complete
   * @param error
   */
  checkPassword(password, complete, error) {
    AirbitzCoreRCT.checkPassword(password, (error, response) => {
      complete(response)
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }

  /**
   * pinLoginSetup
   * @param enable
   * @param complete
   * @param error
   */
  pinLoginSetup(enable, complete, error) {
    AirbitzCoreRCT.pinLoginSetup(enable, (error, response) => {
      complete(response)
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }

  getWallets(complete, error) {
    AirbitzCoreRCT.getWallets((wallets) => {
      var ws = JSON.parse(wallets)

      for (i = 0; i < ws.length; i++) {
        walletsReturn[i] = new ABCWallet(this, ws[i])
      }
      complete(walletsReturn)
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }

}

/**
 * AirbitzCore class
 */
class AirbitzCore {

  /**
   * init
   *
   * @param apikey
   * @param hbits
   * @param complete
   * @param error
   */
  init (apikey, hbits, complete, error) {
    AirbitzCoreRCT.init(apikey, hbits, (error, response) => {
      console.log("ABC Initialized")
      account = new ABCAccount(response)
      complete(account)
    }, (rcterror) => {
      error(makeABCError(rcterror))
    })
  }

  /**
   * createAccount
   *
   * @param username
   * @param password
   * @param pin
   * @param complete
   * @param error
   */
  createAccount (username, password, pin, complete, error) {
    AirbitzCoreRCT.createAccount(username, password, pin, (error, response) => {
      console.log("account created")
      complete(new ABCAccount(response))
    }, (rcterror) => {
      error(makeABCError(rcterror))
    })
  }

  /**
   * passwordLogin
   *
   * @param username
   * @param password
   * @param otp
   * @param complete
   * @param error
   */
  passwordLogin(username, password, otp, complete, error) {
    AirbitzCoreRCT.passwordLogin(username, password, otp, (error, response) => {
      complete(new ABCAccount(response))
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }

  /**
   * pinLogin
   *
   * @param username
   * @param pin
   * @param complete
   * @param error
   */
  pinLogin(username, pin, complete, error) {
    AirbitzCoreRCT.pinLogin(username, pin, (error, response) => {
      complete(new ABCAccount(response))
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }

  /**
   * accountHasPassword
   * @param accountName
   * @param complete
   * @param error
   */
  accountHasPassword(accountName, complete, error) {
    AirbitzCoreRCT.accountHasPassword(accountName, (error, response) => {
      complete(response)
    }, (rtcerror) => {
      error(new ABCError(rtcerror['code'], rtcerror['message']))
    })
  }


}


module.exports.AirbitzCore = AirbitzCore