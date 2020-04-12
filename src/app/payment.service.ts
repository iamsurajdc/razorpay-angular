import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private http: HttpClient
  ) { }

  baseURL: any = "http://localhost:6005/api/user/";

  get WindowRef() {
    return window;
  }

  createOrder(orderDetails) {
  console.log("PaymentService -> baseURL", this.baseURL)
    return this.http.post(`${this.baseURL}createRazorpayOrder`, orderDetails);
  }

  capturePayment(paymemntDetails) {
    return this.http.post(`${this.baseURL}capturePayment`, paymemntDetails);
    // return this.http.post(environment.cloudFunctions.capturePayment,paymemntDetails);
}
}