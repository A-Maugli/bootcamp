import algosdk from "algosdk";
import * as bkr from "beaker-ts";
export class Auction extends bkr.ApplicationClient {
    desc: string = "";
    override appSchema: bkr.Schema = { declared: { highest_bidder: { type: bkr.AVMType.bytes, key: "highest_bidder", desc: "", static: false }, highest_bid: { type: bkr.AVMType.uint64, key: "highest_bid", desc: "", static: false }, auction_end: { type: bkr.AVMType.uint64, key: "auction_end", desc: "", static: false }, asa: { type: bkr.AVMType.uint64, key: "asa", desc: "", static: false }, asa_amount: { type: bkr.AVMType.uint64, key: "asa_amount", desc: "", static: false } }, reserved: {} };
    override acctSchema: bkr.Schema = { declared: {}, reserved: {} };
    override approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKaW50Y2Jsb2NrIDAgMSA0CmJ5dGVjYmxvY2sgMHg2ODY5Njc2ODY1NzM3NDVmNjI2OTY0IDB4NjE3NTYzNzQ2OTZmNmU1ZjY1NmU2NCAweDY4Njk2NzY4NjU3Mzc0NWY2MjY5NjQ2NDY1NzIgMHg2MTczNjEgMHg2MTczNjE1ZjYxNmQ2Zjc1NmU3NCAweAp0eG4gTnVtQXBwQXJncwppbnRjXzAgLy8gMAo9PQpibnogbWFpbl9sMTIKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMApwdXNoYnl0ZXMgMHgzNDJkNTU4MiAvLyAib3B0X2ludG9fYXNhKGFzc2V0KXZvaWQiCj09CmJueiBtYWluX2wxMQp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweGYwYWE3MDIzIC8vICJzdGFydF9hdWN0aW9uKHVpbnQ2NCx1aW50NjQsYXhmZXIpdm9pZCIKPT0KYm56IG1haW5fbDEwCnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4MzkwNDJhZWUgLy8gImJpZChwYXksYWNjb3VudCl2b2lkIgo9PQpibnogbWFpbl9sOQp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweGI1ODkwNjg2IC8vICJjbGFpbV9iaWQoKXZvaWQiCj09CmJueiBtYWluX2w4CnR4bmEgQXBwbGljYXRpb25BcmdzIDAKcHVzaGJ5dGVzIDB4MTQ3MTI1MzQgLy8gImNsYWltX2Fzc2V0KGFzc2V0LGFjY291bnQsYWNjb3VudCl2b2lkIgo9PQpibnogbWFpbl9sNwplcnIKbWFpbl9sNzoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDcKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMgppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDgKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMwppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDkKbG9hZCA3CmxvYWQgOApsb2FkIDkKY2FsbHN1YiBjbGFpbWFzc2V0XzkKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDg6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CmNhbGxzdWIgY2xhaW1iaWRfOAppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sOToKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQppbnRjXzAgLy8gMApnZXRieXRlCnN0b3JlIDYKdHhuIEdyb3VwSW5kZXgKaW50Y18xIC8vIDEKLQpzdG9yZSA1CmxvYWQgNQpndHhucyBUeXBlRW51bQppbnRjXzEgLy8gcGF5Cj09CmFzc2VydApsb2FkIDUKbG9hZCA2CmNhbGxzdWIgYmlkXzcKaW50Y18xIC8vIDEKcmV0dXJuCm1haW5fbDEwOgp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CiYmCmFzc2VydAp0eG5hIEFwcGxpY2F0aW9uQXJncyAxCmJ0b2kKc3RvcmUgMgp0eG5hIEFwcGxpY2F0aW9uQXJncyAyCmJ0b2kKc3RvcmUgMwp0eG4gR3JvdXBJbmRleAppbnRjXzEgLy8gMQotCnN0b3JlIDQKbG9hZCA0Cmd0eG5zIFR5cGVFbnVtCmludGNfMiAvLyBheGZlcgo9PQphc3NlcnQKbG9hZCAyCmxvYWQgMwpsb2FkIDQKY2FsbHN1YiBzdGFydGF1Y3Rpb25fNQppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sMTE6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKIT0KJiYKYXNzZXJ0CnR4bmEgQXBwbGljYXRpb25BcmdzIDEKaW50Y18wIC8vIDAKZ2V0Ynl0ZQpjYWxsc3ViIG9wdGludG9hc2FfNAppbnRjXzEgLy8gMQpyZXR1cm4KbWFpbl9sMTI6CnR4biBPbkNvbXBsZXRpb24KaW50Y18wIC8vIE5vT3AKPT0KYm56IG1haW5fbDE2CnR4biBPbkNvbXBsZXRpb24KcHVzaGludCA1IC8vIERlbGV0ZUFwcGxpY2F0aW9uCj09CmJueiBtYWluX2wxNQplcnIKbWFpbl9sMTU6CnR4biBBcHBsaWNhdGlvbklECmludGNfMCAvLyAwCiE9CmFzc2VydApjYWxsc3ViIGRlbGV0ZV8zCmludGNfMSAvLyAxCnJldHVybgptYWluX2wxNjoKdHhuIEFwcGxpY2F0aW9uSUQKaW50Y18wIC8vIDAKPT0KYXNzZXJ0CmNhbGxzdWIgY3JlYXRlXzAKaW50Y18xIC8vIDEKcmV0dXJuCgovLyBjcmVhdGUKY3JlYXRlXzA6CmJ5dGVjXzIgLy8gImhpZ2hlc3RfYmlkZGVyIgpieXRlYyA1IC8vICIiCmFwcF9nbG9iYWxfcHV0CmJ5dGVjXzAgLy8gImhpZ2hlc3RfYmlkIgppbnRjXzAgLy8gMAphcHBfZ2xvYmFsX3B1dApieXRlY18xIC8vICJhdWN0aW9uX2VuZCIKaW50Y18wIC8vIDAKYXBwX2dsb2JhbF9wdXQKYnl0ZWNfMyAvLyAiYXNhIgppbnRjXzAgLy8gMAphcHBfZ2xvYmFsX3B1dApieXRlYyA0IC8vICJhc2FfYW1vdW50IgppbnRjXzAgLy8gMAphcHBfZ2xvYmFsX3B1dApyZXRzdWIKCi8vIGF1dGhfb25seQphdXRob25seV8xOgppbnRjXzAgLy8gMAphcHBfcGFyYW1zX2dldCBBcHBDcmVhdG9yCnN0b3JlIDEKc3RvcmUgMApsb2FkIDAKPT0KcmV0c3ViCgovLyBhdXRoX29ubHkKYXV0aG9ubHlfMjoKaW50Y18wIC8vIDAKYXBwX3BhcmFtc19nZXQgQXBwQ3JlYXRvcgpzdG9yZSAxCnN0b3JlIDAKbG9hZCAwCj09CnJldHN1YgoKLy8gZGVsZXRlCmRlbGV0ZV8zOgppdHhuX2JlZ2luCmludGNfMSAvLyBwYXkKaXR4bl9maWVsZCBUeXBlRW51bQppbnRjXzAgLy8gMAppdHhuX2ZpZWxkIEZlZQppbnRjXzAgLy8gMAphcHBfcGFyYW1zX2dldCBBcHBDcmVhdG9yCnN0b3JlIDEKc3RvcmUgMApsb2FkIDAKaXR4bl9maWVsZCBSZWNlaXZlcgppbnRjXzAgLy8gMAppdHhuX2ZpZWxkIEFtb3VudAppbnRjXzAgLy8gMAphcHBfcGFyYW1zX2dldCBBcHBDcmVhdG9yCnN0b3JlIDEKc3RvcmUgMApsb2FkIDAKaXR4bl9maWVsZCBDbG9zZVJlbWFpbmRlclRvCml0eG5fc3VibWl0CnJldHN1YgoKLy8gb3B0X2ludG9fYXNhCm9wdGludG9hc2FfNDoKc3RvcmUgMTAKdHhuIFNlbmRlcgpjYWxsc3ViIGF1dGhvbmx5XzEKLy8gdW5hdXRob3JpemVkCmFzc2VydApieXRlY18zIC8vICJhc2EiCmFwcF9nbG9iYWxfZ2V0CmludGNfMCAvLyAwCj09CmFzc2VydApieXRlY18zIC8vICJhc2EiCmxvYWQgMTAKdHhuYXMgQXNzZXRzCmFwcF9nbG9iYWxfcHV0Cml0eG5fYmVnaW4KaW50Y18yIC8vIGF4ZmVyCml0eG5fZmllbGQgVHlwZUVudW0KaW50Y18wIC8vIDAKaXR4bl9maWVsZCBGZWUKZ2xvYmFsIEN1cnJlbnRBcHBsaWNhdGlvbkFkZHJlc3MKaXR4bl9maWVsZCBBc3NldFJlY2VpdmVyCmxvYWQgMTAKdHhuYXMgQXNzZXRzCml0eG5fZmllbGQgWGZlckFzc2V0CmludGNfMCAvLyAwCml0eG5fZmllbGQgQXNzZXRBbW91bnQKaXR4bl9zdWJtaXQKcmV0c3ViCgovLyBzdGFydF9hdWN0aW9uCnN0YXJ0YXVjdGlvbl81OgpzdG9yZSAxMwpzdG9yZSAxMgpzdG9yZSAxMQp0eG4gU2VuZGVyCmNhbGxzdWIgYXV0aG9ubHlfMgovLyB1bmF1dGhvcml6ZWQKYXNzZXJ0CmJ5dGVjXzEgLy8gImF1Y3Rpb25fZW5kIgphcHBfZ2xvYmFsX2dldAppbnRjXzAgLy8gMAo9PQphc3NlcnQKbG9hZCAxMwpndHhucyBBc3NldFJlY2VpdmVyCmdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCj09CmFzc2VydApsb2FkIDEzCmd0eG5zIFhmZXJBc3NldApieXRlY18zIC8vICJhc2EiCmFwcF9nbG9iYWxfZ2V0Cj09CmFzc2VydApieXRlYyA0IC8vICJhc2FfYW1vdW50Igpsb2FkIDEzCmd0eG5zIEFzc2V0QW1vdW50CmFwcF9nbG9iYWxfcHV0CmJ5dGVjXzEgLy8gImF1Y3Rpb25fZW5kIgpsb2FkIDEyCmdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKKwphcHBfZ2xvYmFsX3B1dApieXRlY18wIC8vICJoaWdoZXN0X2JpZCIKbG9hZCAxMQphcHBfZ2xvYmFsX3B1dApyZXRzdWIKCi8vIHBheQpwYXlfNjoKc3RvcmUgMTcKc3RvcmUgMTYKaXR4bl9iZWdpbgppbnRjXzEgLy8gcGF5Cml0eG5fZmllbGQgVHlwZUVudW0KbG9hZCAxNgppdHhuX2ZpZWxkIFJlY2VpdmVyCmxvYWQgMTcKaXR4bl9maWVsZCBBbW91bnQKaW50Y18wIC8vIDAKaXR4bl9maWVsZCBGZWUKaXR4bl9zdWJtaXQKcmV0c3ViCgovLyBiaWQKYmlkXzc6CnN0b3JlIDE1CnN0b3JlIDE0Cmdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKYnl0ZWNfMSAvLyAiYXVjdGlvbl9lbmQiCmFwcF9nbG9iYWxfZ2V0CjwKYXNzZXJ0CmxvYWQgMTQKZ3R4bnMgQW1vdW50CmJ5dGVjXzAgLy8gImhpZ2hlc3RfYmlkIgphcHBfZ2xvYmFsX2dldAo+CmFzc2VydApsb2FkIDE0Cmd0eG5zIFNlbmRlcgp0eG4gU2VuZGVyCj09CmFzc2VydApsb2FkIDE0Cmd0eG5zIFJlY2VpdmVyCmdsb2JhbCBDdXJyZW50QXBwbGljYXRpb25BZGRyZXNzCj09CmFzc2VydApieXRlY18yIC8vICJoaWdoZXN0X2JpZGRlciIKYXBwX2dsb2JhbF9nZXQKYnl0ZWMgNSAvLyAiIgohPQpieiBiaWRfN19sMgpieXRlY18yIC8vICJoaWdoZXN0X2JpZGRlciIKYXBwX2dsb2JhbF9nZXQKbG9hZCAxNQp0eG5hcyBBY2NvdW50cwo9PQphc3NlcnQKYnl0ZWNfMiAvLyAiaGlnaGVzdF9iaWRkZXIiCmFwcF9nbG9iYWxfZ2V0CmJ5dGVjXzAgLy8gImhpZ2hlc3RfYmlkIgphcHBfZ2xvYmFsX2dldApjYWxsc3ViIHBheV82CmJpZF83X2wyOgpieXRlY18wIC8vICJoaWdoZXN0X2JpZCIKbG9hZCAxNApndHhucyBBbW91bnQKYXBwX2dsb2JhbF9wdXQKYnl0ZWNfMiAvLyAiaGlnaGVzdF9iaWRkZXIiCmxvYWQgMTQKZ3R4bnMgU2VuZGVyCmFwcF9nbG9iYWxfcHV0CnJldHN1YgoKLy8gY2xhaW1fYmlkCmNsYWltYmlkXzg6Cmdsb2JhbCBMYXRlc3RUaW1lc3RhbXAKYnl0ZWNfMSAvLyAiYXVjdGlvbl9lbmQiCmFwcF9nbG9iYWxfZ2V0Cj4KYXNzZXJ0CmludGNfMCAvLyAwCmFwcF9wYXJhbXNfZ2V0IEFwcENyZWF0b3IKc3RvcmUgMQpzdG9yZSAwCmxvYWQgMApieXRlY18wIC8vICJoaWdoZXN0X2JpZCIKYXBwX2dsb2JhbF9nZXQKY2FsbHN1YiBwYXlfNgpyZXRzdWIKCi8vIGNsYWltX2Fzc2V0CmNsYWltYXNzZXRfOToKc3RvcmUgMjAKc3RvcmUgMTkKc3RvcmUgMTgKZ2xvYmFsIExhdGVzdFRpbWVzdGFtcApieXRlY18xIC8vICJhdWN0aW9uX2VuZCIKYXBwX2dsb2JhbF9nZXQKPgphc3NlcnQKbG9hZCAxOQp0eG5hcyBBY2NvdW50cwppbnRjXzAgLy8gMAphcHBfcGFyYW1zX2dldCBBcHBDcmVhdG9yCnN0b3JlIDEKc3RvcmUgMApsb2FkIDAKPT0KYXNzZXJ0CmxvYWQgMTgKdHhuYXMgQXNzZXRzCmJ5dGVjXzMgLy8gImFzYSIKYXBwX2dsb2JhbF9nZXQKPT0KYXNzZXJ0Cml0eG5fYmVnaW4KaW50Y18yIC8vIGF4ZmVyCml0eG5fZmllbGQgVHlwZUVudW0KaW50Y18wIC8vIDAKaXR4bl9maWVsZCBGZWUKbG9hZCAxOAp0eG5hcyBBc3NldHMKaXR4bl9maWVsZCBYZmVyQXNzZXQKYnl0ZWMgNCAvLyAiYXNhX2Ftb3VudCIKYXBwX2dsb2JhbF9nZXQKaXR4bl9maWVsZCBBc3NldEFtb3VudApsb2FkIDE4CmFzc2V0X3BhcmFtc19nZXQgQXNzZXRDcmVhdG9yCnN0b3JlIDIxCml0eG5fZmllbGQgQXNzZXRDbG9zZVRvCml0eG5fc3VibWl0CnJldHN1Yg==";
    override clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKcHVzaGludCAwIC8vIDAKcmV0dXJu";
    override methods: algosdk.ABIMethod[] = [
        new algosdk.ABIMethod({ name: "opt_into_asa", desc: "", args: [{ type: "asset", name: "asset", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "start_auction", desc: "", args: [{ type: "uint64", name: "starting_price", desc: "" }, { type: "uint64", name: "length", desc: "" }, { type: "axfer", name: "axfer", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "bid", desc: "", args: [{ type: "pay", name: "payment", desc: "" }, { type: "account", name: "previous_bidder", desc: "" }], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "claim_bid", desc: "", args: [], returns: { type: "void", desc: "" } }),
        new algosdk.ABIMethod({ name: "claim_asset", desc: "", args: [{ type: "asset", name: "asset", desc: "" }, { type: "account", name: "creator", desc: "" }, { type: "account", name: "asset_creator", desc: "" }], returns: { type: "void", desc: "" } })
    ];
    async opt_into_asa(args: {
        asset: bigint;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this.execute(await this.compose.opt_into_asa({ asset: args.asset }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async start_auction(args: {
        starting_price: bigint;
        length: bigint;
        axfer: algosdk.TransactionWithSigner | algosdk.Transaction;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this.execute(await this.compose.start_auction({ starting_price: args.starting_price, length: args.length, axfer: args.axfer }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async bid(args: {
        payment: algosdk.TransactionWithSigner | algosdk.Transaction;
        previous_bidder: string;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this.execute(await this.compose.bid({ payment: args.payment, previous_bidder: args.previous_bidder }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async claim_bid(txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this.execute(await this.compose.claim_bid(txnParams));
        return new bkr.ABIResult<void>(result);
    }
    async claim_asset(args: {
        asset: bigint;
        creator: string;
        asset_creator: string;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<void>> {
        const result = await this.execute(await this.compose.claim_asset({ asset: args.asset, creator: args.creator, asset_creator: args.asset_creator }, txnParams));
        return new bkr.ABIResult<void>(result);
    }
    compose = {
        opt_into_asa: async (args: {
            asset: bigint;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "opt_into_asa"), { asset: args.asset }, txnParams, atc);
        },
        start_auction: async (args: {
            starting_price: bigint;
            length: bigint;
            axfer: algosdk.TransactionWithSigner | algosdk.Transaction;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "start_auction"), { starting_price: args.starting_price, length: args.length, axfer: args.axfer }, txnParams, atc);
        },
        bid: async (args: {
            payment: algosdk.TransactionWithSigner | algosdk.Transaction;
            previous_bidder: string;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "bid"), { payment: args.payment, previous_bidder: args.previous_bidder }, txnParams, atc);
        },
        claim_bid: async (txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "claim_bid"), {}, txnParams, atc);
        },
        claim_asset: async (args: {
            asset: bigint;
            creator: string;
            asset_creator: string;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "claim_asset"), { asset: args.asset, creator: args.creator, asset_creator: args.asset_creator }, txnParams, atc);
        }
    };
}
