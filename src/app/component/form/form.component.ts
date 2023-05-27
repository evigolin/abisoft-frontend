import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

//services
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  //string
  title = '';

  //number
  cost: number = 0;

  //formGroup
  form!: FormGroup;

  //boolean
  submit: boolean = false;
  loading: boolean = false;

  //number
  id!: number;

  //any
  data: any;

  constructor(private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private _location: Location) {

    //get params
    this.route.params.subscribe(params => {
      if (params['id']) {
        //active spinner
        this.loading = true;

        this.title = 'Editar';
        this.id = params['id'];
      } else {
        this.title = 'Agregar';
      }
    });

    //init form
    this.initForm();
  }

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    if (this.id) {
      await this.getData();
    }
  }

  initForm(form?: any) {
    this.form = this.fb.group({
      nameComplete: new FormControl(form?.nameComplete || '', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]),
      age: new FormControl(form?.age || '', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
      birthdate: new FormControl(form?.birthdate || '', [Validators.required]),
      registrationDate: new FormControl(form?.registrationDate || '', [Validators.required]),
      cost: new FormControl(form?.cost || 0, [Validators.required]),
    });
  }

  async validateData() {

    if (this.form.valid) {
      let validateNameComplete = this.validateNameComplete();

      if (validateNameComplete) {
        let age = this.calculeAgeWithBrithDate();

        if (Number(this.form.value.age) < 1) {
          alert("Basados en la fecha de nacimiento usted tiene " + age);
          return;
        }

        //verifica si la edad ingresada coincide con la edad calculada desde la fecha de nacimiento
        if (age !== Number(this.form.value.age)) {
          alert("La edad ingresada es distinta de la edad basada en su fecha de nacimiento");
          return;
        }

        //valida que la persona sea mayor de edad
        if (age < 18) {
          alert("La edad debe ser mayor de 18");
          return;
        }

        //validar si la fecha de registro es mayor que la fecha de nacimiento
        const format = 'DD-MM-YYYY HH:mm';
        const simulateToken = moment(this.form.value.birthdate, format);
        const simulateNow = moment(this.form.value.registrationDate, format);

        let result = simulateNow.isAfter(simulateToken);

        if (result) {
          alert("La fecha de inscripcion debe ser mayor a la fecha de nacimiento");
          return;
        }

        if (this.id) {
          await this.updateData();
        } else {
          await this.saveData();
        }
      }

    } else {
      this.submit = true;
    }
  }

  validateNameComplete() {
    let phrase: string[] = this.form.value.nameComplete.split(" ");

    if (phrase.length < 2) {
      alert("El nombre debe contener minimo dos nombres");
      return false;

    } else {
      let quantity = 0;

      for (let i = 0; i < phrase.length; i++) {
        if (phrase[i].length > 3) {
          quantity += 1;
        }
      }

      if (quantity < 2) {
        alert("Los nombres deben contener minimo 4 caracteres");
        return false;
      }
    }

    return true;
  }

  calculeAgeWithBrithDate() {
    var nacimiento = moment(this.form.value.birthdate);
    var hoy = moment();
    var age = hoy.diff(nacimiento, "years");

    return age;
  }

  calculeQuantityWithBrithDate(date: string) {
    var register = moment(date);
    var hoy = moment();
    var quantity = hoy.diff(register, "years");

    return quantity;
  }

  validateCost(value: any) {
    let quantity = this.calculeQuantityWithBrithDate(value.target.value);

    this.form.get('cost')?.setValue(quantity * 100);
    this.cost = quantity * 100;
  }

  async saveData() {
    try {

      this.loading = true;

      let response = await this.apiService.addData(this.form.value);
      console.log("🚀 ~ file: app.component.ts:144 ~ AppComponent ~ saveData ~ response:", response);

      if (response) {
        await this.resetFrom();
        alert("Solicitud realizada con exito");
      }

      this.loading = false;

      //return
      this.backClicked();


    } catch (errs) {
      console.log("🚀 ~ file: app.component.ts:147 ~ AppComponent ~ saveData ~ errs:", errs);

      this.loading = false;
      alert("Error al intentar realizar la solucitud");

    }
  }

  async updateData() {
    try {

      this.loading = true;

      let response = await this.apiService.updateData(this.form.value, this.id);
      console.log("🚀 ~ file: app.component.ts:144 ~ AppComponent ~ saveData ~ response:", response);

      if (response) {
        await this.resetFrom();
        alert("Actualizacion realizada con exito");
      }

      this.loading = false;

      //return
      this.backClicked();

    } catch (errs) {
      console.log("🚀 ~ file: app.component.ts:147 ~ AppComponent ~ saveData ~ errs:", errs);

      this.loading = false;
      alert("Error al intentar realizar la solucitud");

    }
  }

  async resetFrom() {
    this.form.get('nameComplete')?.setValue('');
    this.form.get('age')?.setValue('');
    this.form.get('birthdate')?.setValue('');
    this.form.get('registrationDate')?.setValue('');
    this.form.get('cost')?.setValue('');
    this.cost = 0;
  }

  async getData() {
    try {
      let response = await this.apiService.getListById(this.id);
      console.log("🚀 ~ file: form.component.ts:193 ~ FormComponent ~ getData ~ respons:", response);

      if (response) {
        await this.initForm(response['data']);

        //inactive spinner
        this.loading = false;
      }

    } catch (errs) {
      console.log("🚀 ~ file: form.component.ts:195 ~ FormComponent ~ getData ~ errs:", errs);

      alert("Error al intentar obtener la informacion");

      //inactive spinner
      this.loading = false;

    }
  }

  backClicked() {
    this._location.back();
  }
}