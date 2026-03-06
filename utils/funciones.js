export const sendError = (res, status, message) => {
  return res.status(status).json({
    status: false,
    error: message
  });
};