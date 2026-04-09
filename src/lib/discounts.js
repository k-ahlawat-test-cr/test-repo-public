function normalizeTier(tier) {
	if (tier === "enterprise") {
		return "enterprise"
	}

	if (tier === "pro") {
		return "pro"
	}

	return "free"
}

function calculateDiscountRate(input) {
	const tier = normalizeTier(input.plan)

	if (tier === "enterprise") {
		return 0.25
	}

	if (tier === "pro") {
		return input.seats > 10 ? 0.15 : 0.1
	}

	return 0
}

function previewDiscountPlan(input) {
	const seats = input.seats || 0
	const monthlySpend = input.monthlySpend || 0
	const baseRate = calculateDiscountRate(input)
	const extraRate = monthlySpend > 5000 ? 0.03 : 0
	const discountRate = baseRate + extraRate
	const discountedSpend = monthlySpend - monthlySpend * discountRate
	const summary = `${normalizeTier(input.plan)}-${seats}`

	return {
		plan: normalizeTier(input.plan),
		seats,
		monthlySpend,
		discountRate,
		discountedSpend: Number(discountedSpend.toFixed(2)),
		summary,
	}
}

module.exports = {
	calculateDiscountRate,
	previewDiscountPlan,
}
