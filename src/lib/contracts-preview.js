function buildInvoiceContractPreview(input) {
	const items = input.items || []

	return {
		customerName: input.customerName,
		itemCount: items.length,
		subtotal: items.reduce((sum, item) => {
			return sum + (item.quantity || 0) * (item.unitPrice || 0)
		}, 0),
		taxRate: input.taxRate || 0,
		total: input.total || 0,
	}
}

function buildDiscountContractPreview(input) {
	return {
		plan: input.plan || "free",
		seats: input.seats || 0,
		monthlySpend: input.monthlySpend || 0,
		discountRate: input.discountRate || 0,
		projectedTotal: input.projectedTotal || 0,
	}
}

module.exports = {
	buildInvoiceContractPreview,
	buildDiscountContractPreview,
}
