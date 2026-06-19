/**
 * extractServerError.js
 *
 * Shared utility that extracts a human-readable string from the various error
 * shapes the server may return (array, nested .errors, stringified JSON, plain string).
 *
 * @param {unknown} serverErr   - The value of error.response?.data from Axios
 * @param {string}  fallback    - Default message if nothing can be extracted
 * @returns {string}
 */
export function extractServerError(serverErr, fallback = 'An unexpected error occurred.') {
  if (!serverErr) return fallback;

  // 1. Direct array: [{ message, msg }]
  if (Array.isArray(serverErr)) {
    const first = serverErr[0];
    return (first?.message || first?.msg) ?? fallback;
  }

  // Narrow to object before accessing named properties
  if (typeof serverErr !== 'object') {
    // Plain string error body
    return typeof serverErr === 'string' ? serverErr : fallback;
  }

  const errObj = /** @type {Record<string, unknown>} */ (serverErr);

  // 2. Standard mapped format: { errors: [{ message, msg }] }
  if (Array.isArray(errObj.errors)) {
    const first = errObj.errors[0];
    return (first?.message || first?.msg) ?? fallback;
  }

  // 3. Stringified JSON (either a plain string or embedded in .message)
  const rawMessage = typeof errObj.message === 'string' ? errObj.message : null;
  if (rawMessage) {
    if (rawMessage.startsWith('{') || rawMessage.startsWith('[')) {
      try {
        const parsed = JSON.parse(rawMessage);
        if (Array.isArray(parsed)) return parsed[0]?.message || parsed[0]?.msg || rawMessage;
        if (typeof parsed === 'object' && parsed !== null) return parsed.message || parsed.msg || rawMessage;
      } catch {
        return rawMessage;
      }
    }
    return rawMessage;
  }

  return fallback;
}
