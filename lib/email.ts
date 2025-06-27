export interface EmailData {
  subject: string;
  message: string;
  to?: string; // Optional, will use SLACK_EMAIL from env if not provided
}

export async function sendEmail(emailData: EmailData) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to send email");
    }

    return result;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

// Example usage functions
export function sendStatusAlert(
  serviceName: string,
  status: string,
  details?: string
) {
  return sendEmail({
    subject: `🚨 Status Alert: ${serviceName} is ${status}`,
    message: `
Service: ${serviceName}
Status: ${status}
${details ? `Details: ${details}` : ""}

Time: ${new Date().toLocaleString()}

Check the status page for more information.
    `.trim(),
  });
}

export function sendIncidentNotification(
  serviceName: string,
  incident: string,
  severity: "low" | "medium" | "high" | "critical" = "medium"
) {
  const severityEmoji = {
    low: "🟡",
    medium: "🟠",
    high: "🔴",
    critical: "💥",
  };

  return sendEmail({
    subject: `${severityEmoji[severity]} Incident: ${serviceName}`,
    message: `
${severityEmoji[severity]} INCIDENT ALERT ${severityEmoji[severity]}

Service: ${serviceName}
Severity: ${severity.toUpperCase()}
Incident: ${incident}

Time: ${new Date().toLocaleString()}

Please check the status page for updates and resolution progress.
    `.trim(),
  });
}
