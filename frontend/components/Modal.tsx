// components/Modal.tsx
'use client';
import React, { useEffect } from 'react';

type ModalProps = {
	title? : string;
	children: React.ReactNode;
	onClose: () => void;
	width?: string; 
}

export default function Modal({ title, children, onClose, width = '720px'}: ModalProps) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent ) => {
			if (e.key === 'Escape') onClose();
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [onClose]);
	
	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
			onClick={onClose} //backdrop 클릭 시 닫기
			role="dialog"
			aria-modal="true"
		>
			<div className="bg-white rounded-lg shadow-lg overflow-hidden"
				style={{ width }}
				onClick={(e) => e.stopPropagation() } //내부 클릭 시 모달 닫히지 않게
			>
				<div className="p-4 border-b flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
					<button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
						<i className="ri -close-line w-5 h-5"/>
					</button>
				</div>
				<div className="p-4 max-h-[520px] overflow-y-auto">{children}</div>
			</div>
		</div>
	);
}
