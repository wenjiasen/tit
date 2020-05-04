export const isProductionModel = (): boolean => {
  return process.env.NODE_ENV === 'production';
};
