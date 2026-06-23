/**
 * @param {string} level - 'info' | 'warn' | 'error'
 * @param {string} component - 'ui' | 'api' | 'state'
 * @param {string} message - Descriptive text log payload
 */
export async function sendLogToServer(level, component, message) {
  // Use the evaluation server endpoint as the fallback target configuration
  const apiBase = process.env.VITE_API_URL;
  const token = process.env.VITE_AUTH_TOKEN;

  const payload = {
    level,
    component,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(`${apiBase}/evaluation-service/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    return response.ok;
  } catch (err) {
    console.error('Logging middleware telemetry sync failed:', err);
    return false;
  }
}