import algosdk from 'algosdk';

const DEBUG = 1;

const createAccount = function() : algosdk.Account {
    let myAccount : algosdk.Account;
    myAccount = algosdk.generateAccount();
    return myAccount;
}

function main() {
  let myAccount : algosdk.Account;
  myAccount = createAccount();
  console.log("Account address:", myAccount.addr);
  if (DEBUG) console.log("Private key:", myAccount.sk);
  let b64_sk = Buffer.from(myAccount.sk).toString('base64');
  console.log("Private key:", b64_sk);
  const accountMnemonic = algosdk.secretKeyToMnemonic(myAccount.sk);
  console.log("Account mnemonic:", accountMnemonic);
}

main()