import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    open: boolean;
    title?: string;
    onClose: () => void;
    children?: React.ReactNode;
}

export default function Modal({ open, title, onClose, children }: ModalProps) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }

        if (open) {
            document.addEventListener('keydown', onKey);
        }

        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) return null;

    const modal = (
        <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close" onClick={onClose} aria-label="Cerrar">
                        ×
                    </button>
                </div>

                <div className="modal-body">{children}</div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

