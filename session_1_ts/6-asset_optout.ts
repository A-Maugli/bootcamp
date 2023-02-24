import algosdk from 'algosdk';
import * as fs from 'fs';
const DEBUG=0;

// define sandbox values for kmd client
const kmd_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const kmd_server = "http://localhost";
const kmd_server_port = 4002;

// define sandbox values for algod client
const algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const algod_server = "http://localhost";
const algod_server_port = 4001;

async function getWalletId(
    kmdClient, 
    walletName) {
    
    // list wallets
    let wallets = await kmdClient.listWallets();
    if(DEBUG) console.log('wallets:', wallets);
    
    // get wallet index for default wallet
    let walletId='';
    wallets.wallets.forEach(item => {
        if (item.name === walletName) {
            walletId = item.id;
        }
    })   
    return walletId;
}

function getAssetIndex(fname: string) {
    var asset_index = 0;
    try {
        var data = fs.readFileSync(fname, 'utf8');
        asset_index = Number(data);
        if (DEBUG) console.log(asset_index);
    } catch (err) {
        console.error(err);
    }
    return asset_index;
}

async function main() {
    // create kmd client
    const kmd_client = new algosdk.Kmd(kmd_token, kmd_server, kmd_server_port);

    // connect to default wallet
    const wallet_name = 'unencrypted-default-wallet';
    const wallet_pw = '';
    let wallet_id = await getWalletId(kmd_client, wallet_name);
    let wallet_handle = await kmd_client.initWalletHandle(wallet_id, wallet_pw);

    // gather the first three accounts from the wallet
    let wallet_addresses = await kmd_client.listKeys(wallet_handle.wallet_handle_token);
    let addr1 = wallet_addresses.addresses[0];
    let addr2 = wallet_addresses.addresses[1];
    let addr3 = wallet_addresses.addresses[2];

    // create algod client
    const algod_client = new algosdk.Algodv2(algod_token, algod_server, algod_server_port);

    // get asset index from file
    let asset_index = getAssetIndex('5_asset_index.txt');
    if (DEBUG) console.log('asset_index:', asset_index);

    // get params
    let params = await algod_client.getTransactionParams().do(); 
    if (DEBUG) console.log('params:', params);

    // build asset optout txn
    let unsigned_txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        suggestedParams: params,
        from: addr2,
        to: addr1, 
        assetIndex: asset_index, 
        amount: 0,
        closeRemainderTo: addr1
    });
    if (DEBUG) console.log('unsigned_txn:', unsigned_txn);

    // sign transaction
    let addr2_sk = await kmd_client.exportKey(wallet_handle.wallet_handle_token, '', addr2);
    if (DEBUG) console.log('addr1_sk:', addr2_sk);
    let signed_txn = await unsigned_txn.signTxn(addr2_sk.private_key);
    if (DEBUG) console.log('signed_txn:', signed_txn);

    // submit transaction
    let tx_id = await algod_client.sendRawTransaction(signed_txn).do();
    console.log("Successfully sent transaction with tx_id: %s", tx_id);
    console.log('tx_id["txId"]:', tx_id['txId']);

    // wait for confirmation
    console.log('Awaiting confirmation (this may take several seconds)...');
    const roundTimeout = 7;
    const confirmed_txn = await algosdk.waitForConfirmation(
      algod_client,
      tx_id['txId'],
      roundTimeout
    );
    console.log('Transaction is successfully completed');

    // log confirmed transaction
    console.log('confirmed_txn:', confirmed_txn);

    // release wallet handle
    let hr = await kmd_client.releaseWalletHandle(wallet_handle['wallet_handle_token']);
    if (DEBUG) console.log('wallet handle released, hr:', hr)
}

main();