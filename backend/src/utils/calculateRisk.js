const calculateRisk = ({
  military,
  economy,
  politics,
}) => {
  return Math.round(
    (military +
      economy +
      politics) /
      3
  );
};

module.exports =
  calculateRisk;