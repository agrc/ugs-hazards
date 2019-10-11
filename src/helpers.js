export const getHazardCodeFromUnitCode = (unitCode) => {
  return unitCode.slice(-3).toUpperCase();
}
