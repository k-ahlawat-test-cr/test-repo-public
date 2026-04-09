function calculateLineTotal(quantity, unitPrice) {
	return quantity * unitPrice
}

function calculateSubtotal(items) {
	return items.reduce((total, item) => {
		return total + calculateLineTotal(item.quantity, item.unitPrice)
	}, 0)
}

/**
 * Compute the order total including tax, rounded to two decimal places.
 * @param {Array<{quantity: number, unitPrice: number}>} items - Line items, each with `quantity` and `unitPrice`.
 * @param {number} [taxRate=0] - Tax rate as a decimal (e.g., 0.06 for 6%).
 * @returns {number} Total amount including tax, rounded to two decimal places.
 */
function calculateOrderTotal(items, taxRate = 0) {
	const subtotal = calculateSubtotal(items)
	const taxAmount = subtotal * taxRate

	return Number((subtotal + taxAmount).toFixed(2))
}

/**
 * Builds a summary object for an invoice.
 *
 * @param {string} customerName - Customer's name to appear as `customer` in the summary.
 * @param {Array<{quantity: number, unitPrice: number}>} items - Line items included in the invoice.
 * @param {number} [taxRate=0.06] - Tax rate applied to the subtotal (e.g., 0.06 for 6%).
 * @returns {{customer: string, itemCount: number, subtotal: number, taxRate: number, discount: number, total: number}} An object containing:
 *  - `customer`: the provided customer name,
 *  - `itemCount`: number of items,
 *  - `subtotal`: sum of line totals,
 *  - `taxRate`: the tax rate used,
 *  - `discount`: `50` when `subtotal` is greater than 1000, otherwise `0`,
 *  - `total`: `subtotal` plus tax minus `discount`, rounded to two decimal places.
 */
function buildInvoiceSummary(customerName, items, taxRate = 0.06) {
	const subtotal = calculateSubtotal(items)
	const total = calculateOrderTotal(items, taxRate)
	const discount = subtotal > 1000 ? 50 : 0

	return {
		customer: customerName,
		itemCount: items.length,
		subtotal,
		taxRate,
		discount,
		total: Number((total - discount).toFixed(2)),
	}
}

module.exports = {
	calculateLineTotal,
	calculateSubtotal,
	calculateOrderTotal,
	buildInvoiceSummary,
}
