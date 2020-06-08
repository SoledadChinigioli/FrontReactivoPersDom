import { Domicilio } from './domicilio';

export interface Persona {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  dni: number;
  domicilio: Domicilio;
}
