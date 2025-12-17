export const formatPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('0') && digits.length === 10) {
    return '254' + digits.substring(1);
  }
  
  if (digits.startsWith('7') && digits.length === 9) {
    return '254' + digits;
  }
  
  if (digits.startsWith('254') && digits.length === 12) {
    return digits;
  }
  
  return digits;
};

export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(num);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};