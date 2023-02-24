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
    kmdClient: algosdk.Kmd, 
    walletName: string) {
    
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

    // connect to wallet
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

    // Create accounts
    let addr1_sk = await kmd_client.exportKey(wallet_handle.wallet_handle_token, wallet_pw, addr1);
    let acct1 = {addr: addr1, sk: addr1_sk.private_key};
    let addr2_sk = await kmd_client.exportKey(wallet_handle.wallet_handle_token, wallet_pw, addr2);
    let acct2 = {addr: addr2, sk: addr2_sk.private_key};

    // create atomic transaction composer
    let atc = new algosdk.AtomicTransactionComposer();

    // create an unsigned payment transaction
    let txn1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: addr2,
        to: addr1,
        amount: algosdk.algosToMicroalgos(0.15),
        suggestedParams: params
    });

    // create signer object
    const txn1_signer = algosdk.makeBasicAccountTransactionSigner(acct2);

    // add txn and signer to Atomic Transaction Composer
    atc.addTransaction({txn: txn1, signer: txn1_signer});

    // build unsigned asset transfer transaction
    let txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        suggestedParams: params,
        from: addr1,
        to: addr2,
        assetIndex: asset_index,
        amount: 100     // this ASA has 2 decimal places, so this is 1.00 FUNTOK
    });

    // create signer object
    const txn2_signer = algosdk.makeBasicAccountTransactionSigner(acct1);

    // add txn and signer to atc
    atc. addTransaction({txn: txn2, signer: txn2_signer});

    // execute atc
    let result = await atc.execute(algod_client, 7);  // waitRounds is 7
    if (DEBUG) console.log(result);
    console.log('Transaction group was successfully executed');

    // release wallet handle
    let hr = await kmd_client.releaseWalletHandle(wallet_handle['wallet_handle_token']);
    if (DEBUG) console.log('wallet handle released, hr:', hr)
}

main();