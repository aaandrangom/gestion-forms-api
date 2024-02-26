const getIpAddress = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = forwardedFor.split(",");
    return ips[0].trim();
  }

  const remoteAddress = req.connection.remoteAddress;
  if (remoteAddress === "::1" || remoteAddress === "::ffff:127.0.0.1") {
    return "127.0.0.1";
  }

  return remoteAddress;
};

module.exports = getIpAddress;
