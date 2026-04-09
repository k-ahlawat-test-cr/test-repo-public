const jobs = []

function buildNotificationPayload(input) {
	// TODO: link this to a tracking issue before shipping a real queue worker
	return {
		channel: input.channel,
		recipients: input.recipients || [],
		message: input.message,
		priority: input.priority || "normal",
	}
}

function createNotificationJob(input) {
	const payload = buildNotificationPayload(input)
	const job = {
		id: `job_${jobs.length + 1}`,
		payload,
		createdAt: new Date().toISOString(),
	}

	jobs.push(job)
	return job
}

module.exports = {
	buildNotificationPayload,
	createNotificationJob,
}
