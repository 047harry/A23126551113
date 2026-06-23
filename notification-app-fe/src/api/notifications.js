// src/api/notifications.js

export async function fetchNotifications(level, component, message) {
  const apiBase = import.meta.env.VITE_API_URL || 'http://4.224.186.213/evaluation-service/logs';
  
  let token = localStorage.getItem('auth_token') || '';
  if (token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }

  // enforce the strict 48-character backend limit by cutting it off at 40 safely
  const cleanMessage = String(message).length > 40 
    ? String(message).substring(0, 37) + "..." 
    : String(message);

  //exact lowercase payload keys required by the validator schema
  const payload = {
    stack: "frontend",
    level: String(level).toLowerCase(),
    package: String(component).toLowerCase(),
    message: cleanMessage
  };

  try {
    const response = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    return data;
  } catch (err) {
    console.error('Failed to dispatch telemetry data framework:', err);
    throw err;
  }
}
