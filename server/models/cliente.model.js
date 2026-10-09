export class Cliente {
  constructor(data) {
    this.nombre = data.nombre || '';
    this.email = data.email || '';
    this.telefono = data.telefono || '';
    this.estado = data.estado || 'activo'; // activo, pendiente, etc.
    this.montoPresupuesto = data.montoPresupuesto || 0;
    this.fechaCreacion = data.fechaCreacion || new Date().toISOString();
  }
}