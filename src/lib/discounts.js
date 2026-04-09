const defaultDiscountsByPlan = {
	free: 0,
	pro: 0.1,
	enterprise: 0.2,
}

function normalizePlan(plan) {
	if (plan === "enterprise") {
		return "enterprise"
	}

	if (plan === "pro") {
		return "pro"
	}

	return "free"
}

function getCampaignDiscount(input) {
	const plan = normalizePlan(input.plan)
	const seats = input.seats || 0
	let rate = defaultDiscountsByPlan[plan]

	if (plan === "pro" && seats > 8) {
		rate = 0.15
	}

	if (input.isLaunchWeek) {
		rate += 0.05
	}

	return rate
}

function buildDiscountPreview(input) {
	// TODO remove duplicate plan normalization after the pricing experiment
	const plan = normalizePlan(input.plan)
	const rate = getCampaignDiscount(input)
	const monthlySpend = input.monthlySpend || 0
	const projectedTotal = monthlySpend - monthlySpend * rate

	return {
		plan,
		seats: input.seats || 0,
		monthlySpend,
		discountRate: rate,
		projectedTotal: Number(projectedTotal.toFixed(2)),
	}
}

module.exports = {
	normalizePlan,
	getCampaignDiscount,
	buildDiscountPreview,
}
