function buildInvoiceSummaryShape(input) {
	const items = input.items || []

	return {
		customerName: input.customerName || "unknown",
		lineItems: items.length,
		taxRate: input.taxRate || 0,
		totalDue: input.totalDue || 0,
	}
}

module.exports = {
	buildInvoiceSummaryShape,
}
