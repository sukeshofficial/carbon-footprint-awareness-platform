/**
 * Extract message from first item in an error array.
 * @param {unknown[]} arr
 * @returns {string | null}
 */
function extractArrayMessage(arr) {
  const first = /** @type {{ message?: string; msg?: string } | undefined} */ (
    arr?.[0]
  );

  return first?.message || first?.msg || null;
}

/**
 * Parse JSON-like error message.
 * @param {string} rawMessage
 * @returns {string}
 */
function parseMessage(rawMessage) {
  try {
    const parsed = JSON.parse(rawMessage);

    if (Array.isArray(parsed)) {
      return extractArrayMessage(parsed) || rawMessage;
    }

    if (typeof parsed === "object" && parsed !== null) {
      const parsedObj = /** @type {{ message?: string; msg?: string }} */ (parsed);

      return parsedObj.message || parsedObj.msg || rawMessage;
    }
  } catch {
    return rawMessage;
  }

  return rawMessage;
}

/**
 * @param {unknown} serverErr
 * @param {string} fallback
 * @returns {string}
 */
export function extractServerError(
  serverErr,
  fallback = "An unexpected error occurred."
) {
  if (!serverErr) return fallback;

  if (Array.isArray(serverErr)) {
    return extractArrayMessage(serverErr) || fallback;
  }

  if (typeof serverErr === "string") {
    return serverErr;
  }

  if (typeof serverErr !== "object") {
    return fallback;
  }

  const errObj = /** @type {Record<string, unknown>} */ (serverErr);

  if (Array.isArray(errObj.errors)) {
    return extractArrayMessage(errObj.errors) || fallback;
  }

  const rawMessage =
    typeof errObj.message === "string" ? errObj.message : null;

  if (!rawMessage) return fallback;

  const isJson =
    rawMessage.startsWith("{") || rawMessage.startsWith("[");

  return isJson ? parseMessage(rawMessage) : rawMessage;
}