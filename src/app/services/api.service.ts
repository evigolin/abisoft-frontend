import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private _http: HttpClient,) { }

  // get data
  async addData(data: any): Promise<any> {
    console.log("🚀 ~ file: api.service.ts:20 ~ ApiService ~ addData ~ data:", data);

    // resquest http
    return firstValueFrom(this._http.post('http://127.0.0.1:8000/api/data/add', data));
  }

  // get datas
  async getList(): Promise<any> {
    // resquest http
    return firstValueFrom(this._http.get('http://127.0.0.1:8000/api/data'));
  }

  // update data
  async updateData(data: any, id: number): Promise<any> {
    console.log("🚀 ~ file: api.service.ts:20 ~ ApiService ~ addData ~ data:", data);

    // resquest http
    return firstValueFrom(this._http.put('http://127.0.0.1:8000/api/data/update/' + id, data));
  }

  // get data by id
  async getListById(id: number): Promise<any> {
    // resquest http
    return firstValueFrom(this._http.get('http://127.0.0.1:8000/api/data/' + id));
  }

  // delete data
  async deleteData(id: number): Promise<any> {
    // resquest http
    return firstValueFrom(this._http.delete('http://127.0.0.1:8000/api/data/delete/' + id));
  }
}
