export class Config {
  static maxChar = 150;
  static pageSizeOptions = [5, 10, 15];
  static regex = [
    '^[A-Za-z0-9_ñáéíóúÑÁÉÍÓÚ -.]+$',
    '^[A-Za-z0-9_ -.\n]+$',
    '^[0-9]+(.[0-9]{1,2})?$'
  ];
}
