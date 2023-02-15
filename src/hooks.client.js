import { Ethereum, Tezos, TON } from '/src/lib/stores.js';
import MetaMask from '/src/lib/pkg/wallet/ethereum/metamask.js';
import TempleWallet from '/src/lib/pkg/wallet/tezos/temple.js';
import TonKeeper from '/src/lib/pkg/wallet/ton/tonkeeper.js';

Ethereum.init({
	MetaMask: new MetaMask()
});
Tezos.init({
	TempleWallet: new TempleWallet()
});
TON.init({
	TonKeeper: new TonKeeper()
});
