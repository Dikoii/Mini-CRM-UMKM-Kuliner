import { ToastState } from '../types';

interface Props {
  toast: ToastState | null;
}

export default function Toast({ toast }: Props) {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const msgLower = toast.msg.toLowerCase();

  let icon = null;
  let borderColor = 'border-slate-200 bg-white text-slate-800';

  if (isError) {
    borderColor = 'border-red-200 bg-red-50 text-red-900';
    icon = (
      <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else {
    borderColor = 'border-emerald-200 bg-emerald-50 text-emerald-950';
    if (msgLower.includes('pelanggan')) {
      icon = (
        <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      );
    } else if (msgLower.includes('pesanan') || msgLower.includes('order')) {
      icon = (
        <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
        </svg>
      );
    } else {
      icon = (
        <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
  }

  return (
    <div
      id="toast-simple"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center w-full max-w-sm p-4 rounded-lg shadow-md border ${borderColor} transition-all duration-300`}
      role="alert"
    >
      {icon}
      <div className="ms-2.5 text-sm font-semibold border-s border-current/20 ps-3.5">
        {toast.msg}
      </div>
    </div>
  );
}
