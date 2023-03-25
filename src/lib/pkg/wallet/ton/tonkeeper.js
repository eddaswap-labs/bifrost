import TonConnect from '@tonconnect/sdk';
import { Address, beginCell, Dictionary, toNano, TonClient } from 'ton';
import { Wallet } from '../wallet';
import { PUBLIC_TON_BRIDGE_ADDRESS } from '$env/static/public';
import { Base64 } from '@tonconnect/protocol';
import { getHttpEndpoint } from '@orbs-network/ton-access';

/**
 * Implements Wallet abstract class for TonKeeper.
 *
 * @class TonKeeper
 */
export default class TonKeeper extends Wallet {
	constructor() {
		super();

		this.available = true;
		this.connector = new TonConnect({
			manifestUrl:
				'https://raw.githubusercontent.com/bifrost-defi/bifrost/main/tonconnect-manifest.json'
		});
	}

	async connectInjected() {
		throw new Error('Injected TonKeeper is not supported.');
	}

	async connectExternal(cb) {
		const walletsList = await TonConnect.getWallets();

		const walletConnectionSource = {
			universalLink: walletsList[0].universalLink,
			bridgeUrl: walletsList[0].bridgeUrl
		};

		this.connector.onStatusChange((wallet) => {
			if (this.connector.connected && wallet) {
				this.address = Address.parseRaw(wallet.account.address).toString();
				cb(this.address);
			}
		}, console.error);

		return this.connector.connect(walletConnectionSource);
	}

	async lockCoins(destAddress, destCoinId, amount) {
		const destAddressHex = parseInt(destAddress, 16);

		const body = beginCell()
			.storeUint(1, 32)
			.storeUint(0, 64)
			.storeUint(destAddressHex, 160)
			.storeUint(destCoinId, 32)
			.endCell();

		const msg = {
			address: PUBLIC_TON_BRIDGE_ADDRESS,
			amount: toNano(amount),
			payload: Base64.encode(body.toBoc())
		};

		await this._send(msg);
	}

	async burnTokens(destAddress, coinId, amount) {
		const endpoint = await getHttpEndpoint();
		const client = new TonClient({ endpoint });

		const getResult = await client.callGetMethod(
			PUBLIC_TON_BRIDGE_ADDRESS,
			'get_jetton_wallet_address',
			[
				{ type: 'int', value: BigInt(coinId) },
				{ type: 'slice', cell: beginCell().storeAddress(this.address).endCell() }
			]
		);

		const jettonWalletAddress = getResult.stack.readAddress();

		const jettonsAmount = toNano(amount);
		const destAddressHex = parseInt(destAddress, 16);

		const customPayload = Dictionary.empty(Dictionary.Keys.Uint(32), Dictionary.Values.Cell());
		customPayload.set(0x4fe560c1, beginCell().storeUint(destAddressHex, 160).endCell());
		customPayload.set(0x53c2ce98, beginCell().storeUint(coinId, 32).endCell());

		const body = beginCell()
			.storeUint(0x595f07bc, 32)
			.storeUint(0, 64)
			.storeCoins(jettonsAmount)
			.storeAddress(null) // no response
			.storeDict(customPayload)
			.endCell();

		const msg = {
			address: jettonWalletAddress,
			amount: toNano('0.02'),
			payload: Base64.encode(body.toBoc())
		};

		await this._send(msg);
	}

	async _send(msg) {
		const request = {
			validUntil: Math.round(Date.now() / 1000 + 7200),
			messages: [msg]
		};

		await this.connector.sendTransaction(request);
	}
}
