const algosdk = require('algosdk');

const DEBUG=0;

// define sandbox values for kmd client
const kmd_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const kmd_server = "http://localhost";
const kmd_server_port = 4002;

// define sandbox values for algod client
const algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algod_server = "http://localhost";
const algod_server_port = 4001;

async function main() {
    // create kmd client
    const kmd_client = new algosdk.Kmd(kmd_token, kmd_server, kmd_server_port);

    // list wallets
    let wallets = await kmd_client.listWallets();
    if(DEBUG) console.log('wallets:', wallets);

    // get wallet id for default wallet
    const wallet_name = 'unencrypted-default-wallet';
    const wallet_pw = '';
    let wallet_id='';
    wallets.wallets.forEach(item => {
        if (item.name === wallet_name) {
            wallet_id = item.id;
        }
    }) 

    // get wallet handle
    let wallet_handle = await kmd_client.initWalletHandle(wallet_id, wallet_pw); 
    if(DEBUG) console.log('wallet_handle:', wallet_handle);

    // get accounts for that wallet
    let wallet_addresses = await kmd_client.listKeys(wallet_handle.wallet_handle_token);
    if(DEBUG) console.log('wallet_addresses:', wallet_addresses);

    // create algod client
    const algodClient = new algosdk.Algodv2(algod_token, algod_server, algod_server_port);

    // get account info for that accounts
    wallet_addresses.addresses.forEach(async (addr) => {
        if(DEBUG) console.log('addr', addr);
        let account_info = await algodClient.accountInformation(addr).do();
        if(DEBUG) console.log('account_info', account_info);
        console.log('%s balance: %s microAlgos', account_info.address, account_info.amount);

    });

    // release wallet handle
    let hr = await kmd_client.releaseWalletHandle(wallet_handle['wallet_handle_token']);
    if (DEBUG) console.log('wallet handle released, hr:', hr)
}

main();