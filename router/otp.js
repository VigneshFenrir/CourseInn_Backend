
const generateOTP = () => {

  const otps = Math.floor(100000 + Math.random() * 900000);
  return otps.toString();
};

module.exports = generateOTP;
