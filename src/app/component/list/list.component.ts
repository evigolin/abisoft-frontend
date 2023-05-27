import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  //array
  items: any[] = [];

  //boolean
  loading: boolean = false;

  constructor(private apiService: ApiService) { }

  async ngOnInit() {
    await this.getList();
  }

  async getList() {
    try {
      let response = await this.apiService.getList();
      this.items = response['list'];
      console.log("🚀 ~ file: list.component.ts:19 ~ ListComponent ~ ngOnInit ~ this.items:", this.items);

    } catch (errs) {
      console.log("🚀 ~ file: list.component.ts:22 ~ ListComponent ~ getList ~ errs:", errs);

    }
  }

  async deleteItem(id: number) {
    console.log("🚀 ~ file: list.component.ts:28 ~ ListComponent ~ deleteItem ~ id:", id);

    //active spinner
    this.loading = true;

    try {
      let response = await this.apiService.deleteData(id);
      console.log("🚀 ~ file: list.component.ts:36 ~ ListComponent ~ deleteItem ~ response:", response);

      //get data
      await this.getList();

      alert('Eliminacion exitosa!!');

      //inactive spinner
      this.loading = false;

    } catch (errs) {
      console.log("🚀 ~ file: list.component.ts:33 ~ ListComponent ~ deleteItem ~ errs:", errs);

      alert('No se pudo realizar la eliminacion del elemento seleccionado');

      //inactive spinner
      this.loading = false;

    }

  }
}
