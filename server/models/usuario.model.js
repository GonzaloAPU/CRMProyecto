export class Usuario {
  constructor(data) {
    this.nombre = data.nombre || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.sector = data.sector || 'Soporte'; // 'Soporte' o 'Gerencia'
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
