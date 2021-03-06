import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  public personas: Persona[]=[];
  public paginaNum: number;
  public paginaSize: number;

  public personaActual: Persona = {
    id: 0,
    nombre: '',
    apellido: '',
    edad: 0,
    dni: null,
    domicilio:  {
      id: 0,
      calle: '',
      numero: 0
    }
  };
  constructor(private personaService: PersonaService) { }

  ngOnInit() {
    
    this.paginaNum = 1;
    this.paginaSize = 10;

    this.getAllPersonas();
  }
//METODO CON PAGINADOR
  getAllPersonas() {
    this.personaService.getAll(this.paginaNum,this.paginaSize).subscribe( res => {
      this.personas = res;
    });
    console.log(this.personas);
  }
  //METODO SIN PAGINADOR
  // getAllPersonas() {
  //   this.personaService.getAll().subscribe( res => {
  //     this.personas = res;      
  //   });
  //   console.log(this.personas);
  //   console.log(this.paginaNum);
  //   console.log(this.paginaSize);
    
  // }

  delete(persona: Persona) {
    const opcion = confirm('¿Desea eliminar este registro?');
    if (opcion === true) {
      this.personaService.delete(persona.id).subscribe(
        res => {
          alert('El registro fue eliminado con éxito');
          const indexPersona = this.personas.indexOf(persona);
          this.personas.splice(indexPersona, 1);
        }
      );
    }
  }

  onPreUpdate(persona: Persona) {
    this.personaActual = persona;
  }

  paginaPrevia(){
    if(this.paginaNum > 1){
      this.paginaNum -= 1;
      this.getAllPersonas();
      
    }    
  }

  paginaSiguiente(){
    let numtemp = this.paginaNum;
    try{
        this.paginaNum += 1;
        this.getAllPersonas();

    }catch{
      alert('No se encontraron más registros');
      this.paginaNum = numtemp;
      this.getAllPersonas();
      // debugger;
      // let reviso1 = this.paginaSize;
      // let reviso2 = this.paginaNum;
    }


  }

}
