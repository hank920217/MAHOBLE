export function getSessionValue(key, fallback = null) {
  try {
    const storedValue = sessionStorage.getItem(key)
    return storedValue ? JSON.parse(storedValue) : fallback
  } catch {
    return fallback
  }
}

export function setSessionValue(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage errors in unsupported or restricted environments.
  }
}

export function removeSessionValue(key) {
  try {
    sessionStorage.removeItem(key)
  } catch {
    // Ignore storage errors in unsupported or restricted environments.
  }
}
