"use strict";
exports.__esModule = true;
var algosdk_1 = require("algosdk");
var DEBUG = 1;
var createAccount = function () {
    var myAccount;
    myAccount = algosdk_1["default"].generateAccount();
    return myAccount;
};
function main() {
    var myAccount;
    myAccount = createAccount();
    console.log("Account address:", myAccount.addr);
    if (DEBUG)
        console.log("Private key:", myAccount.sk);
    var b64_sk = Buffer.from(myAccount.sk).toString('base64');
    console.log("Private key:", b64_sk);
    var accountMnemonic = algosdk_1["default"].secretKeyToMnemonic(myAccount.sk);
    console.log("Account mnemonic:", accountMnemonic);
}
main();
