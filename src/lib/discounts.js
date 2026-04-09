const defaultDiscountsByPlan = {
	free: 0,
	pro: 0.1,
	enterprise: 0.2,
}

/**
 * Normalize a plan identifier to one of "enterprise", "pro", or "free".
 *
 * @param {string} plan - Input plan identifier; commonly "enterprise", "pro", or other values.
 * @returns {string} The normalized plan: `"enterprise"` if input equals `"enterprise"`, `"pro"` if input equals `"pro"`, otherwise `"free"`.
 */
function normalizePlan(plan) {
	if (plan === "enterprise") {
		return "enterprise"
	}

	if (plan === "pro") {
		return "pro"
	}

	return "free"
}

/**
 * Compute the campaign discount rate based on plan, number of seats, and launch-week status.
 *
 * @param {Object} input - Input parameters that influence the discount.
 * @param {string} [input.plan] - The customer plan; values other than "pro" or "enterprise" are treated as "free".
 * @param {number} [input.seats=0] - Number of seats; defaults to 0 when falsy.
 * @param {any} [input.isLaunchWeek] - If truthy, increases the discount by 0.05.
 * @returns {number} The final discount rate as a decimal (for example, 0.1 for 10%). The rate is derived from the normalized plan's base rate, overridden to 0.15 for "pro" when seats > 8, and increased by 0.05 if `isLaunchWeek` is truthy.
 */
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

/**
 * Build a preview of how a campaign discount affects monthly spend.
 * @param {Object} input - Input values for the preview.
 * @param {string} input.plan - Customer plan identifier (e.g., "free", "pro", "enterprise").
 * @param {number} [input.seats] - Number of seats; defaults to 0 when falsy.
 * @param {number} [input.monthlySpend] - Current monthly spend; defaults to 0 when falsy.
 * @param {boolean} [input.isLaunchWeek] - Whether the campaign is in launch week (affects discount calculation).
 * @returns {Object} An object summarizing the discount preview.
 * @returns {string} return.plan - Normalized plan.
 * @returns {number} return.seats - Number of seats used for the calculation.
 * @returns {number} return.monthlySpend - Monthly spend used for the calculation.
 * @returns {number} return.discountRate - Applied discount rate (decimal, e.g., 0.15).
 * @returns {number} return.projectedTotal - Projected monthly total after discount, rounded to two decimals.
 */
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
