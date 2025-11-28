const createToken = (userId) => {
  const token = jwt.sign(
    { userId: userId },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "3d" }
  );
};

module.exports = createToken;
