import ETHLogo from '$lib/images/eth_logo.png';
import TZSLogo from '$lib/images/tzs_logo.svg';
import TONLogo from '$lib/images/ton_logo.svg';

export let coins = [
	{
		nativeSymbol: 'ETH',
		wrappedSymbol: 'bETH',
		logo: ETHLogo,
		logoSize: 20
	},
	{
		nativeSymbol: 'XTZ',
		wrappedSymbol: 'bXTZ',
		logo: TZSLogo,
		logoSize: 20
	},
	{
		nativeSymbol: 'TON',
		wrappedSymbol: 'bTON',
		logo: TONLogo,
		logoSize: 25
	}
];
