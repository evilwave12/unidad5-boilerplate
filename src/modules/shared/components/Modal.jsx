import { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children }) {
  // Cerrar con la tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]); //le indica a React que solo vuelva a ejecutar (y limpiar) este efecto cuando cambie el valor de isOpen o la referencia de onClose.

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-xl font-bold text-med-primary-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-med-text-muted hover:text-med-text-main text-xl leading-none"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;