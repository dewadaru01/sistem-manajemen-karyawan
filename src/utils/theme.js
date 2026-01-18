export const getTheme = (isDark) => {
  return isDark ? {
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-gray-100',
    subtext: 'text-gray-400',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
    input: 'bg-gray-700 border-gray-600 text-gray-100',
    button: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  } : {
    bg: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    subtext: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100',
    input: 'bg-white border-gray-300 text-gray-900',
    button: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  };
};