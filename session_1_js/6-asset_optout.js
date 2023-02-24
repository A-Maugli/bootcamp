const algosdk = require('algosdk');
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

async function getWalletId(
    kmdClient, 
    walletName) {
    
    // list wallets
    wallets = await kmdClient.listWallets();
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

function getAssetIndex(fname) {
    try {
        var data = fs.readFileSync(fname, 'utf8');
        var asset_index = Number(data);
        if (DEBUG) console.log(asset_index);
    } catch (err) {
        console.error(err);
    }
    return asset_index;
}

async function main() {
    // create kmd client
    kmd_client = new algosdk.Kmd(kmd_token, kmd_server, kmd_server_port);

    // connect to default wallet
    wallet_id = await getWalletId(kmd_client, 'unencrypted-default-wallet');
    wallet_handle = await kmd_client.initWalletHandle(wallet_id, '');

    // gather the first three accounts from the wallet
    wallet_addresses = await kmd_client.listKeys(wallet_handle.wallet_handle_token);
    addr1 = wallet_addresses.addresses[0];
    addr2 = wallet_addresses.addresses[1];
    addr3 = wallet_addresses.addresses[2];

    // create algod client
    algod_client = new algosdk.Algodv2(algod_token, algod_server, algod_server_port);

    // get asset index from file
    asset_index = getAssetIndex('5_asset_index.txt');
    if (DEBUG) console.log('asset_index:', asset_index);

    // build asset create txn
    params = await algod_client.getTransactionParams().do(); 
    if (DEBUG) console.log('params:', params);

    unsigned_txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({ 
        suggestedParams: params,
        from: addr2,
        to: addr1, 
        closeRemainderTo: addr1,
        assetIndex: asset_index, 
        amount: 0
    });
    if (DEBUG) console.log('unsigned_txn:', unsigned_txn);

    // sign transaction
    addr2_sk = await kmd_client.exportKey(wallet_handle.wallet_handle_token, '', addr2);
    if (DEBUG) console.log('addr1_sk:', addr2_sk);
    signed_txn = await unsigned_txn.signTxn(addr2_sk.private_key);
    if (DEBUG) console.log('signed_txn:', signed_txn);

    // submit transaction
    tx_id = await algod_client.sendRawTransaction(signed_txn).do();
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
}

main();