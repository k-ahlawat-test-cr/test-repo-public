/**
 * Calculates the total price for a line item.
 * @param {number} quantity - Number of units.
 * @param {number} unitPrice - Price per unit.
 * @returns {number} The product of quantity and unitPrice.
 */
function calculateLineTotal(quantity, unitPrice) {
	return quantity * unitPrice
}

/**
 * Calculate the subtotal for a list of invoice items.
 * @param {Array<{quantity: number, unitPrice: number}>} items - Array of items each containing `quantity` and `unitPrice`.
 * @returns {number} The subtotal equal to the sum of each item's `quantity * unitPrice`.
 */
function calculateSubtotal(items) {
	return items.reduce((total, item) => {
		return total + calculateLineTotal(item.quantity, item.unitPrice)
	}, 0)
}

/**
 * Calculate the total amount for an order including tax.
 *
 * @param {Array<{quantity: number, unitPrice: number}>} items - Line items where each item has `quantity` and `unitPrice`.
 * @param {number} taxRate - Tax rate as a decimal (for example, 0.08 for 8%).
 * @returns {number} The order total including tax, rounded to two decimal places.
 */
function calculateOrderTotal(items, taxRate = 0) {
	const subtotal = calculateSubtotal(items)
	const taxAmount = subtotal * taxRate

	return Number((subtotal + taxAmount).toFixed(2))
}

/**
 * Builds a compact invoice summary for a customer.
 * @param {string} customerName - Customer's display name.
 * @param {Array<Object>} items - Array of line items; each item should have numeric `quantity` and `unitPrice`.
 * @param {number} [taxRate=0.08] - Tax rate as a decimal (for example, `0.08` for 8%).
 * @returns {Object} The invoice summary containing:
 *  - `customerName` (string)
 *  - `itemCount` (number) — number of items
 *  - `subtotal` (number) — sum of line totals
 *  - `taxRate` (number) — the applied tax rate
 *  - `total` (number) — final amount rounded to two decimal places
 */
function buildInvoiceSummary(customerName, items, taxRate = 0.08) {
	const subtotal = calculateSubtotal(items)
	const total = calculateOrderTotal(items, taxRate)

	return {
		customerName,
		itemCount: items.length,
		subtotal,
		taxRate,
		total,
	}
}

module.exports = {
	calculateLineTotal,
	calculateSubtotal,
	calculateOrderTotal,
	buildInvoiceSummary,
}
