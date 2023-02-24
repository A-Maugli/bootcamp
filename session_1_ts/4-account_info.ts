import algosdk from 'algosdk';

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

    // connect to wallet
    let wallet_handle = await kmd_client.initWalletHandle(wallet_id, wallet_pw);

    // gather accounts from wallet
    let wallet_addresses = await kmd_client.listKeys(wallet_handle.wallet_handle_token);

    // create algod client
    const algod_client = new algosdk.Algodv2(algod_token, algod_server, algod_server_port);

    // print account details
    wallet_addresses.addresses.forEach(async (addr) => {
        if(DEBUG) console.log('addr', addr);
        let account_info = await algod_client.accountInformation(addr).do();
        console.log('account_info', JSON.stringify(account_info, null, 4));
    });

    // release wallet handle
    let hr = await kmd_client.releaseWalletHandle(wallet_handle['wallet_handle_token']);
    if (DEBUG) console.log('wallet handle released, hr:', hr);
}

main();