import React from 'react';
import type { PuestoPublico } from '../../tipos/puesto';
import Modal from '../comunes/Modal';

interface Props {
	puesto: PuestoPublico;
	open: boolean;
	onClose: () => void;
}

function formatearSalarioCompleto(puesto: PuestoPublico): React.ReactNode | string {
	if (puesto.salarioDolares && puesto.salarioColones) {
		const usd = parseFloat(puesto.salarioDolares).toLocaleString('es-CR', { minimumFractionDigits: 2 });
		const crc = parseFloat(puesto.salarioColones).toLocaleString('es-CR', { minimumFractionDigits: 0 });
		return (
			<div style={{ lineHeight: '1.4' }}>
				<div>${usd} USD</div>
				<div>₡{crc} CRC</div>
			</div>
		);
	}
	return puesto.salario || 'No especificado';
}

export default function PuestoDetalleModal({ puesto, open, onClose }: Props) {
	return (
		<Modal open={open} onClose={onClose} title={`${puesto.puesto} — ${puesto.empresa}`}>
			<p className="text-muted">Tipo: <strong>{puesto.tipo}</strong></p>
			<p className="text-muted">Salario:</p>
			<div style={{ marginLeft: '1rem', marginBottom: '1rem' }}>
				{formatearSalarioCompleto(puesto)}
			</div>

			<h4 className="mt-2">Descripción</h4>
			<p>{puesto.descripcion || 'Sin descripción registrada.'}</p>

			<h4 className="mt-2">Características requeridas</h4>
			{puesto.caracteristicas && puesto.caracteristicas.length > 0 ? (
				<ul className="job-feature-list">
					{puesto.caracteristicas.map((c, i) => (
						<li key={i}>{c}</li>
					))}
				</ul>
			) : (
				<p>No hay características registradas.</p>
			)}
		</Modal>
	);
}


