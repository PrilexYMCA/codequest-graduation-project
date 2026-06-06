export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  loading,
  className = '',
  ...props
}) {
  const variants = {
    primary:
      'bg-ink-900 text-cream-50 hover:bg-brand-700 active:bg-brand-800 disabled:bg-ink-300 disabled:cursor-not-allowed',
    secondary:
      'bg-cream-50 text-ink-900 border border-ink-900/15 hover:bg-cream-200 hover:border-ink-900/25 disabled:opacity-50',
    ghost:
      'text-ink-700 hover:bg-cream-200 disabled:opacity-50',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-[15px]',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
