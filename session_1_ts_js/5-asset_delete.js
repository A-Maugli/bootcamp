const algosdk = require('algosdk');;
const fs = require('fs');

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

    // gather the first three accounts
    let wallet_addresses = await kmd_client.listKeys(wallet_handle.wallet_handle_token);
    let addr1 = wallet_addresses.addresses[0];
    let addr2 = wallet_addresses.addresses[1];
    let addr3 = wallet_addresses.addresses[2];

    // create algod client
    const algod_client = new algosdk.Algodv2(algod_token, algod_server, algod_server_port);

    // get params
    let params = await algod_client.getTransactionParams().do(); 
    if (DEBUG) console.log('params:', params);

    // get asset_index from file
    const file_name = '5_asset_index.txt';
    let asset_index = 0;
    try {
        let data = fs.readFileSync(file_name, 'utf8');
        asset_index = Number(data);
        if (DEBUG) console.log(asset_index);
    } catch (err) {
        console.error(err);
    }

    // build asset destroy txn
    let unsigned_txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
        from: addr1,
        suggestedParams: params, 
        assetIndex: asset_index
    })
    if (DEBUG) console.log('unsigned_txn:', unsigned_txn);

    // sign transaction
    let addr1_sk = await kmd_client.exportKey(wallet_handle.wallet_handle_token, wallet_pw, addr1);
    if (DEBUG) console.log('addr1_sk:', addr1_sk);
    let signed_txn = unsigned_txn.signTxn(addr1_sk.private_key);
    if (DEBUG) console.log('signed_txn:', signed_txn);

    // submit transaction
    let tx_id = await algod_client.sendRawTransaction(signed_txn).do();
    console.log("Successfully sent transaction with tx_id: %s", tx_id);
    console.log('tx_id["txId"]:', tx_id['txId']);

    // wait for confirmation
    console.log('Awaiting confirmation (this will take several seconds)...');
    const roundTimeout = 7;
    const confirmed_txn = await algosdk.waitForConfirmation(
      algod_client,
      tx_id['txId'],
      roundTimeout
    );
    console.log('Transaction is successfully completed');

    // log confirmed transaction
    if (DEBUG) console.log('confirmed_txn:', confirmed_txn);

    // remove env file
    ////const file_name = '5_asset_index.txt';
    if (fs.existsSync(file_name)) {
        fs.unlink(file_name, (err) => {
            if (err) {
                console.log(err);
            }
            console.log(file_name, ' deleted');
        })
    }

    // release wallet handle
    let hr = await kmd_client.releaseWalletHandle(wallet_handle['wallet_handle_token']);
    if (DEBUG) console.log('wallet handle released, hr:', hr)
}

main();