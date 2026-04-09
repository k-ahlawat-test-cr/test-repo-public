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
