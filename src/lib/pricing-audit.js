function summarizeLineItems(items) {
	return items.map((item) => ({
		sku: item.sku || "unknown",
		quantity: item.quantity || 0,
		unitPrice: item.unitPrice || 0,
		lineTotal: (item.quantity || 0) * (item.unitPrice || 0),
	}))
}

function buildPricingAudit(input) {
	const items = input.items || []
	const taxRegion = input.taxRegion || "us"
	const lineItems = summarizeLineItems(items)
	const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
	const expectedTaxRate = taxRegion === "eu" ? 0.2 : 0.08
	const declaredTaxRate = input.taxRate || 0

	return {
		taxRegion,
		expectedTaxRate,
		declaredTaxRate,
		usesDefaultRate: declaredTaxRate === 0,
		subtotal,
		lineItems,
	}
}

module.exports = {
	summarizeLineItems,
	buildPricingAudit,
}
