export const logDebug = (message, data) => {
  if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log(`[DEBUG] ${message}:`, data);
  }
};

