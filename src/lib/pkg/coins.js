import ETHLogo from '$lib/images/eth_logo.png';
import TZSLogo from '$lib/images/tzs_logo.svg';
import TONLogo from '$lib/images/ton_logo.svg';

export let coins = [
	{
		id: 66,
		name: 'Ethereum',
		nativeSymbol: 'ETH',
		syntheticSymbol: 'bETH',
		logo: ETHLogo,
		logoSize: 20
	},
	{
		id: 1729,
		name: 'Tezos',
		nativeSymbol: 'XTZ',
		syntheticSymbol: 'bXTZ',
		logo: TZSLogo,
		logoSize: 20
	},
	{
		id: 444,
		name: 'The Open Network',
		nativeSymbol: 'TON',
		syntheticSymbol: 'bTON',
		logo: TONLogo,
		logoSize: 25
	}
];
