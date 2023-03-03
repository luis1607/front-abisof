import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup,Validators} from '@angular/forms'
import { ClientServiceService } from './services/client-service.service';


interface Client{
  name?:string,
  lastName?:string,
  nameComplete?:string,
  age?:number,
  dateBorn?: string,
  dateIncription?:string,
  cost?:number,
  _id:string

}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{
  title = 'PruebaAbisoft';
  public dateMinInscription:string=''
  public today = new Date().toISOString().slice(0, 10);
  public headerTable: string[] = ['nombre completo','edad', 'costo','Fecha Nacimiento','','']
  public clientSelected:any = null
  public listClients:Client[] = []
  public form: FormGroup = {} as FormGroup

  constructor(private fb: FormBuilder, private clientService:ClientServiceService){
    this.form = this.fb.group({
      name: ['',[Validators.required,Validators.minLength(4)]],
      lastName:['',[Validators.required,Validators.minLength(4)]],
      age: [null,[Validators.required,Validators.min(17)]],
      dateBorn:['',[Validators.required]],
      dateInscription:['',[Validators.required]],
      cost: [null,[Validators.required],]
    })
  }

  get formName(){
    return this.form.get('name')
  }

  get formLastName(){
    return this.form.get('lastName')
  }

  get formAge(){
    return this.form.get('age')
  }

  get formDateBorn(){
    return this.form.get('dateBorn')
  }

  get formDateInsciption(){
    return this.form.get('dateInscription')
  }
  get formCost(){
    return this.form.get('cost')
  }

  ngOnInit(){
    this.callClients()

    this.formDateInsciption?.valueChanges.subscribe(
      dato=>{
        if(dato){
          this.getCost(dato)
        }

      }
    )
    this.formDateBorn?.valueChanges.subscribe(
      dateSelected=>{
        this.dateMinInscription = dateSelected
        if(dateSelected){
          let edad = this.getAge(dateSelected)
          this.formAge?.setValue(edad)
        }
      }
    )

  }

  callClients(){
    this.clientService.getClients().subscribe((res:any)=>{
      this.listClients = res
    })

  }

  getCost(dateSlected:string){
    let yearActual = new Date().getFullYear();
    let yearSelected = parseInt(dateSlected.slice(0,4))
    if(yearSelected > yearActual){
      this.formCost?.setValue(0)
    }else{
      let cost = (yearActual-yearSelected)*100
      this.formCost?.setValue(cost)
    }
  }

  save(){

    const objRequest = {
      ...this.form.value,
      nameComplete: `${this.formName?.value} ${this.formLastName?.value}`
    }

    delete objRequest.name;
    delete objRequest.lastName;


    if(this.clientSelected){
      this.clientService.updateCliente(this.clientSelected._id,objRequest).subscribe(response=>{
        console.log("respuesta del back", response)
        this.callClients()
      })
    }else{
      this.clientService.createCient(objRequest).subscribe(response=>{
        console.log("esta es la respuesta del back",response)
        this.callClients()
      })
    }

    this.clientSelected = null
    this.form.reset()

  }

  deleteClient(id:string){
    this.clientService.deleteClient(id).subscribe(res=>{
      this.callClients()
    })
  }

  editProduct(id:string){
    this.clientService.getDetailClient(id).subscribe((res:any)=>{
      console.log(res)
      this.clientSelected = res.client;
      const name = this.clientSelected.nameComplete.split(" ")
      this.formName?.setValue(name[0]);
      this.formLastName?.setValue(name[1])
      this.formAge?.setValue(this.clientSelected.age)
      this.formDateBorn?.setValue(this.clientSelected.dateBorn.split('T')[0])
      this.formDateInsciption?.setValue(this.clientSelected.dateInscription.split('T')[0])
      this.formCost?.setValue(this.clientSelected.cost)
    })
  }


   getAge(dateString:string) {
    let hoy = new Date()
    let fechaNacimiento = new Date(dateString)
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
    if (
      diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--
    }
    return edad
  }

}
