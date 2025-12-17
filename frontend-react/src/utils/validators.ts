export const validatePhone = (phone: string): boolean => {
  const regex = /^(?:254|\+254|0)?(7[0-9]{8})$/;
  return regex.test(phone);
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};