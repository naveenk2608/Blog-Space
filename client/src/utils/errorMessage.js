// Turns an API (axios) error into a message that is safe to show to the user
export const getErrorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
  const data = err?.response?.data;
  if (data?.msg) return data.msg;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.msg).join(', ');
  }
  // No response at all: the server is down, still waking up, or unreachable
  if (err?.request && !err?.response) {
    return 'Cannot reach the server. Please try again in a moment.';
  }
  return fallback;
};
