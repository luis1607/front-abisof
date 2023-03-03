import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ClientServiceService {

  public url:string = 'http://localhost:4000/api/clients'


  constructor(private http:HttpClient) { }

  getClients(){
    return this.http.get(this.url)
  }

  createCient(client:any){
    return this.http.post(this.url,client)
  }

  getDetailClient(id:string){
    return this.http.get(`${this.url}/${id}`)
  }

  updateCliente(id:string,client:any){
    return this.http.put(`${this.url}/${id}`,client)
  }

  deleteClient(id:string){
    return this.http.delete(`${this.url}/${id}`)
  }

}
