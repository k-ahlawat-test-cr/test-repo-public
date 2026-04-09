export interface Alert {
	readonly id: string
	readonly channel: "email" | "slack"
	readonly message: string
	readonly sent: boolean
}

export class AlertService {
	private readonly alerts: Alert[] = []

	public queueAlert(alert: Omit<Alert, "sent">): Alert {
		const queuedAlert: Alert = {
			...alert,
			sent: false,
		}

		this.alerts.push(queuedAlert)
		return queuedAlert
	}

	public listPendingAlerts(): Alert[] {
		return this.alerts.filter((alert) => !alert.sent)
	}

	public listAlertsByChannel(channel: Alert["channel"]): Alert[] {
		return this.alerts.filter((alert) => alert.channel === channel)
	}

	public markSent(alertId: string): Alert | null {
		const alert = this.alerts.find((entry) => entry.id === alertId)
		if (!alert) {
			return null
		}

		const updatedAlert: Alert = {
			...alert,
			sent: true,
		}
		const index = this.alerts.findIndex((entry) => entry.id === alertId)
		this.alerts.splice(index, 1, updatedAlert)
		return updatedAlert
	}
}

export const alertService = new AlertService()
