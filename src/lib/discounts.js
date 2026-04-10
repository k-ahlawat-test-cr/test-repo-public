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
 * Compute the campaign discount rate from plan, number of seats, and launch-week status.
 *
 * @param {Object} input - Input parameters that influence the discount.
 * @param {string} [input.plan] - Customer plan; values other than "pro" or "enterprise" are treated as "free".
 * @param {number} [input.seats=0] - Number of seats; defaults to 0 when falsy.
 * @param {any} [input.isLaunchWeek] - If truthy, increases the discount by 0.05.
 * @returns {number} The final discount rate as a decimal. Starts from the normalized plan's base rate, is set to 0.15 for "pro" when seats > 8, and is increased by 0.05 if `isLaunchWeek` is truthy.
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
 * Build a preview showing how the campaign discount changes monthly spend.
 * @param {Object} input - Input values for the preview.
 * @param {string} input.plan - Customer plan identifier (e.g., "free", "pro", "enterprise").
 * @param {number} [input.seats] - Number of seats; defaults to 0 when falsy.
 * @param {number} [input.monthlySpend] - Current monthly spend; defaults to 0 when falsy.
 * @param {boolean} [input.isLaunchWeek] - Whether the campaign is in launch week (adds 0.05 to the discount when truthy).
 * @returns {Object} An object summarizing the discount preview.
 * @property {string} plan - Normalized plan.
 * @property {number} seats - Number of seats used for the calculation.
 * @property {number} monthlySpend - Monthly spend used for the calculation.
 * @property {number} discountRate - Applied discount rate (decimal, e.g., 0.15).
 * @property {number} projectedTotal - Projected monthly total after discount, rounded to two decimals.
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
