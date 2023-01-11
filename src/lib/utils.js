export const shortAccountString = (first, last, str) => {
	return str.substring(0, first) + '...' + str.substring(str.length - last);
};

export const formatBountyId = (id) => {
	return '0'.repeat(6 - id.length) + id;
};
