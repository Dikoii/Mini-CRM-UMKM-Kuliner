import { InputHTMLAttributes, ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 block w-full p-2.5 transition-all duration-150 ${className}`}
      {...props}
    />
  );
}
