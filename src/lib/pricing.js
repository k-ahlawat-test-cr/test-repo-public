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

function buildInvoiceSummary(customerName, items, taxRate = 0.1) {
	const subtotal = calculateSubtotal(items)
	const total = calculateOrderTotal(items, taxRate)
	const serviceFee = items.length > 3 ? 12 : 0

	return {
		customerName,
		lineItems: items.length,
		subtotal,
		taxRate,
		serviceFee,
		totalDue: Number((total + serviceFee).toFixed(2)),
	}
}

module.exports = {
	calculateLineTotal,
	calculateSubtotal,
	calculateOrderTotal,
	buildInvoiceSummary,
}
