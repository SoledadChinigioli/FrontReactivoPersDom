import { Component, OnInit, Host, Input, ViewChild, ElementRef } from '@angular/core';
import { TableComponent } from '../table/table.component';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(private personaService: PersonaService, @Host() private tabla: TableComponent, private formBuilder: FormBuilder) { }

  @Input() set personaActual(valor) {
    this.onBuild();
    if (valor) {
      this.personaOriginal = valor;
      this.formPersona.patchValue({
        id: valor.id,
        nombre: valor.nombre,
        apellido: valor.apellido,
        edad: valor.edad,
        dni: valor.dni,
        calle: valor.domicilio.calle,
        numero: valor.domicilio.numero
      });
      if (valor.id !== 0) {
        this.edit = true;
      } else {
        this.edit = false;
      }
    }
  }

  @ViewChild('btnClose', {static: true}) btnClose: ElementRef;

  public formPersona: FormGroup;
  public personaNueva : Persona = {
    id: 0,
    nombre: '',
    apellido: '',
    edad: 0,
    dni: 0, 
    domicilio: {
      id: 0,
      calle: '',
      numero: 0
    }
  };

  public personaOriginal: any;
  public edit = false;
  public isError = false;

  ngOnInit() {
    this.onBuild();
  }

  onBuild() {
    this.formPersona = this.formBuilder.group({
      id: new FormControl(0),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      edad: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{1,8}')]),
      dni: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{1,8}')]),
      calle: new FormControl('', Validators.required),
      numero: new FormControl(null, [Validators.required, Validators.pattern('[0-9]{1,8}')])
    });
  }

  onSave(formPersona: FormGroup): void {
    if (formPersona.invalid) {
      this.isError = true;
    } else {
      debugger;
      if (formPersona.value.id === 0) {
        // Agregar
        this.add(formPersona);
      } else {
        this.update(formPersona);
      }
      this.btnClose.nativeElement.click();
    }
  }

  // add(persona: Persona) {
  //   this.personaService.post(persona).subscribe(
  //     res => {
  //       this.tabla.personas.push(res);
  //       this.limpiarFormulario();
  //     },
  //     err => {
  //       alert('Ocurrió un error al agregar la persona');
  //     }
  //   );
  // }

  add(fp: FormGroup) {
    this.personaNueva.nombre = fp.value.nombre;
    this.personaNueva.apellido = fp.value.apellido;
    this.personaNueva.edad = fp.value.edad;
    this.personaNueva.dni = fp.value.dni;
    this.personaNueva.domicilio.calle = fp.value.calle;
    this.personaNueva.domicilio.numero = fp.value.numero;

    this.personaService.post(this.personaNueva).subscribe(
      res => {
        this.tabla.personas.push(res);
        this.limpiarFormulario();
      },
      err => {
        alert('Ocurrió un error al agregar la persona');
      }
    );
  }

  update(fp: FormGroup) {

    this.personaNueva.id = fp.value.id;
    this.personaNueva.nombre = fp.value.nombre;
    this.personaNueva.apellido = fp.value.apellido;
    this.personaNueva.edad = fp.value.edad;
    this.personaNueva.dni = fp.value.dni;
    this.personaNueva.domicilio.calle = fp.value.calle;
    this.personaNueva.domicilio.numero = fp.value.numero;
    
debugger;
  
    this.personaService.put(this.personaNueva.id, this.personaNueva).subscribe(
      res => {
        alert('Persona fue actualizada con éxito');
        const cambio = this.tabla.personas.filter( item => item.id !== this.personaNueva.id);
        this.tabla.personas = cambio;
        this.tabla.personas.unshift(this.personaNueva);
      
      },
      err => {
        alert('Ocurrió un error al actualizar persona');
      }
    );
  }

  onClose() {
    this.limpiarFormulario();
  }

  limpiarFormulario(){

    this.personaActual= {
        id: 0,
        nombre: '',
        apellido: '',
        edad: 0,
        dni: null,
        calle: '',
        numero: 0     
      };

    // this.formPersona.value.nombre ="";
    // this.formPersona.value.apellido ="";
    // this.formPersona.value.edad = null;
    // this.formPersona.value.dni = null;
    // this.formPersona.value.calle ="";
    // this.formPersona.value.numero =null;

    this.isError = false;
  }

  onCloseAlert() {
    this.isError = false;
  }

}
