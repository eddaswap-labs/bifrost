import ETHLogo from '$lib/images/eth_logo.png';
import TZSLogo from '$lib/images/tzs_logo.svg';
import TONLogo from '$lib/images/ton_logo.svg';

export let coins = [
	{
		nativeSymbol: 'ETH',
		syntheticSymbol: 'bETH',
		logo: ETHLogo,
		logoSize: 20
	},
	{
		nativeSymbol: 'XTZ',
		syntheticSymbol: 'bXTZ',
		logo: TZSLogo,
		logoSize: 20
	},
	{
		nativeSymbol: 'TON',
		syntheticSymbol: 'bTON',
		logo: TONLogo,
		logoSize: 25
	}
];
