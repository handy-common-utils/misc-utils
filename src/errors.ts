function getErrorDetails(err: unknown): { message: string; statusCode: string } {
  const msg = (err as any)?.errorMessage ?? (err as Error)?.message ?? String(err);
  const statusCode = String((err as any)?.response?.status ?? (err as any)?.statusCode ?? (err as any)?.status);
  return { message: msg, statusCode };
}

/**
 * Checks if the error could be a networking timeout error.
 * @param err The error to check.
 * @returns True if the error is a networking timeout error, false otherwise.
 */
export function couldBeNetworkingTimeoutError(err: unknown): boolean {
  if (err == null) {
    return false;
  }
  const { message, statusCode } = getErrorDetails(err);
  return statusCode === '504' || message.includes('ETIMEDOUT');
}

/**
 * Checks if the error could be a temporary networking error.
 * @param err The error to check.
 * @returns True if the error is a temporary networking error, false otherwise.
 */
export function couldBeTemporaryNetworkingError(err: unknown): boolean {
  if (err == null) {
    return false;
  }
  const { message, statusCode } = getErrorDetails(err);
  return statusCode === '504' || message.includes('ECONNREFUSED') || message.includes('ETIMEDOUT') || message.includes('EAI_AGAIN') || message.includes('socket hang up');
}

/**
 * Checks if the error could be a server error.
 * @param err The error to check.
 * @returns True if the error is a server error, false otherwise.
 */
export function couldBeServerError(err: unknown): boolean {
  if (err == null) {
    return false;
  }
  const { message, statusCode } = getErrorDetails(err);
  return /5\d{2}/.test(statusCode) || message.includes('Internal Server Error');
}