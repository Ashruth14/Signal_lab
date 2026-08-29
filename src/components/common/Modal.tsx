import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthMap: Record<string, string> = {
    sm: '384px',
    md: '448px',
    lg: '512px',
    xl: '576px',
    '2xl': '672px',
    '3xl': '768px',
    '4xl': '896px',
    '5xl': '1024px',
  };

  const modalContent = (
    <>
      {/* Full-screen backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          backgroundColor: 'rgba(0, 0, 0, 0.30)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Centered scroll wrapper */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          overflowY: 'auto',
          pointerEvents: 'none',
        }}
      >
        {/* Modal dialog card */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: maxWidthMap[maxWidth] || '672px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #ebebeb',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
            pointerEvents: 'auto',
            margin: 'auto',
            animation: 'modal-scale-in 0.15s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: '1px solid #ebebeb',
              padding: '20px 24px',
              backgroundColor: '#ffffff',
              borderRadius: '16px 16px 0 0',
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: '#171717',
                  margin: 0,
                }}
              >
                {title}
              </h3>
              {subtitle && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#8f8f8f',
                    fontFamily: 'monospace',
                    lineHeight: '1.6',
                    marginTop: '4px',
                    marginBottom: 0,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                borderRadius: '6px',
                padding: '6px',
                color: '#8f8f8f',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#171717';
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8f8f8f';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X style={{ height: '16px', width: '16px' }} />
            </button>
          </div>

          {/* Body Content */}
          <div
            style={{
              padding: '20px 24px',
              maxHeight: '75vh',
              overflowY: 'auto',
              color: '#171717',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};
