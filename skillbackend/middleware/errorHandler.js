const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === "MongoServerError" && error.code === 11000) {
    return res.status(409).json({
      success: false,
      error: "An account with this email already exists",
    });
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(", "),
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
};

module.exports = errorHandler;
