export const Button = ({ children, onClick, disabled = false, variant = 'primary', ...props }) => {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-black',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded font-medium ${styles[variant]} disabled:opacity-50 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      {...props}
    >
      {children}
    </button>
  );
};
