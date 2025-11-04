export async function withRetry<T>(fn: () => Promise<T>, attempts = 5, baseDelay = 1000): Promise<T> {
  let lastError: any = null;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      // For 503 errors, use a longer base delay
      const effectiveBaseDelay = err?.status === 503 ? baseDelay * 2 : baseDelay;
      const delay = effectiveBaseDelay * Math.pow(2, i); // exponential backoff
      // Log transient error and retry
      // eslint-disable-next-line no-console
      console.warn(`AI call failed (attempt ${i + 1}/${attempts}), retrying in ${delay}ms:`, err && err.message ? err.message : err);
      // If last attempt, break and throw after loop
      if (i < attempts - 1) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
  // All attempts failed
  // eslint-disable-next-line no-console
  console.error('All AI call attempts failed:', lastError);
  throw lastError;
}
