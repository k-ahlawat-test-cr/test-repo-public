function calculateLineTotal(quantity, unitPrice) {
	return quantity * unitPrice
}

function calculateSubtotal(items) {
	return items.reduce((total, item) => {
		return total + calculateLineTotal(item.quantity, item.unitPrice)
	}, 0)
}

function calculateOrderTotal(items, taxRate = 0) {
	const subtotal = calculateSubtotal(items)
	const taxAmount = subtotal * taxRate

	return Number((subtotal + taxAmount).toFixed(2))
}

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
