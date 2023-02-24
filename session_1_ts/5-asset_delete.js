"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var algosdk_1 = require("algosdk");
var fs = require("fs");
var DEBUG = 0;
// define sandbox values for kmd client
var kmd_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
var kmd_server = "http://localhost";
var kmd_server_port = 4002;
// define sandbox values for algod client
var algod_token = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
var algod_server = "http://localhost";
var algod_server_port = 4001;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var kmd_client, wallets, wallet_name, wallet_pw, wallet_id, wallet_handle, wallet_addresses, addr1, addr2, addr3, algod_client, params, file_name, asset_index, data, unsigned_txn, addr1_sk, signed_txn, tx_id, roundTimeout, confirmed_txn, hr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    kmd_client = new algosdk_1["default"].Kmd(kmd_token, kmd_server, kmd_server_port);
                    return [4 /*yield*/, kmd_client.listWallets()];
                case 1:
                    wallets = _a.sent();
                    if (DEBUG)
                        console.log('wallets:', wallets);
                    wallet_name = 'unencrypted-default-wallet';
                    wallet_pw = '';
                    wallet_id = '';
                    wallets.wallets.forEach(function (item) {
                        if (item.name === wallet_name) {
                            wallet_id = item.id;
                        }
                    });
                    return [4 /*yield*/, kmd_client.initWalletHandle(wallet_id, wallet_pw)];
                case 2:
                    wallet_handle = _a.sent();
                    return [4 /*yield*/, kmd_client.listKeys(wallet_handle.wallet_handle_token)];
                case 3:
                    wallet_addresses = _a.sent();
                    addr1 = wallet_addresses.addresses[0];
                    addr2 = wallet_addresses.addresses[1];
                    addr3 = wallet_addresses.addresses[2];
                    algod_client = new algosdk_1["default"].Algodv2(algod_token, algod_server, algod_server_port);
                    return [4 /*yield*/, algod_client.getTransactionParams()["do"]()];
                case 4:
                    params = _a.sent();
                    if (DEBUG)
                        console.log('params:', params);
                    file_name = '5_asset_index.txt';
                    asset_index = 0;
                    try {
                        data = fs.readFileSync(file_name, 'utf8');
                        asset_index = Number(data);
                        if (DEBUG)
                            console.log(asset_index);
                    }
                    catch (err) {
                        console.error(err);
                    }
                    unsigned_txn = algosdk_1["default"].makeAssetDestroyTxnWithSuggestedParamsFromObject({
                        from: addr1,
                        suggestedParams: params,
                        assetIndex: asset_index
                    });
                    if (DEBUG)
                        console.log('unsigned_txn:', unsigned_txn);
                    return [4 /*yield*/, kmd_client.exportKey(wallet_handle.wallet_handle_token, wallet_pw, addr1)];
                case 5:
                    addr1_sk = _a.sent();
                    if (DEBUG)
                        console.log('addr1_sk:', addr1_sk);
                    signed_txn = unsigned_txn.signTxn(addr1_sk.private_key);
                    if (DEBUG)
                        console.log('signed_txn:', signed_txn);
                    return [4 /*yield*/, algod_client.sendRawTransaction(signed_txn)["do"]()];
                case 6:
                    tx_id = _a.sent();
                    console.log("Successfully sent transaction with tx_id: %s", tx_id);
                    console.log('tx_id["txId"]:', tx_id['txId']);
                    // wait for confirmation
                    console.log('Awaiting confirmation (this will take several seconds)...');
                    roundTimeout = 7;
                    return [4 /*yield*/, algosdk_1["default"].waitForConfirmation(algod_client, tx_id['txId'], roundTimeout)];
                case 7:
                    confirmed_txn = _a.sent();
                    console.log('Transaction is successfully completed');
                    // log confirmed transaction
                    if (DEBUG)
                        console.log('confirmed_txn:', confirmed_txn);
                    // remove env file
                    ////const file_name = '5_asset_index.txt';
                    if (fs.existsSync(file_name)) {
                        fs.unlink(file_name, function (err) {
                            if (err) {
                                console.log(err);
                            }
                            console.log(file_name, ' deleted');
                        });
                    }
                    return [4 /*yield*/, kmd_client.releaseWalletHandle(wallet_handle['wallet_handle_token'])];
                case 8:
                    hr = _a.sent();
                    if (DEBUG)
                        console.log('wallet handle released, hr:', hr);
                    return [2 /*return*/];
            }
        });
    });
}
main();
