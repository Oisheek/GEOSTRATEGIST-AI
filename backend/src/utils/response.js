const success = (
  res,
  data,
  message = "Success"
) => {
  return res.json({
    success: true,
    message,
    data,
  });
};

module.exports = {
  success,
};