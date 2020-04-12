import { environment } from './../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../services/cart.service';
import { PaymentService } from '../payment.service';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  products: any[] = [];
  objectKeys = Object.keys;
  totalPrice = 0;
  quantity = 0;
  payableAmount = 0;
  WindowRef: any;
  processingPayment: boolean;
  paymentResponse:any = {};
  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private changeRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cartService.getCartItems()
      .subscribe(cartItems => {
        this.products = cartItems;
        this.calculatePrice();
      });
      this.WindowRef = this.paymentService.WindowRef;
  }


  increaseProductQuantity(product) {
    product.quantity++;
    this.quantity += 1;
    this.totalPrice += product.price;
  }

  decreaseProductQuantity(product) {
    product.quantity--;
    this.quantity -= 1;
    this.totalPrice -= product.price;
  }

  calculatePrice() {
    this.totalPrice = 0;
    this.quantity = 0;
    for(let i = 0; i < this.products.length;i++) {
      this.totalPrice += this.products[i].quantity * this.products[i].price ;
      this.quantity += this.products[i].quantity ;
    }
  }

  proceedToPay($event) {
    this.processingPayment = true;
    this.payableAmount =  this.totalPrice * 100 ;
    this.initiatePaymentModal($event);
  }


  initiatePaymentModal(event) {

    console.log("In initiatePaymentModal");
    let receiptNumber = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
    
    let orderDetails = {
      amount: this.payableAmount,
      receipt: receiptNumber,
      currency:"INR",
      payment_capture: 1,
      notes: ""
}

    this.paymentService.createOrder(orderDetails)
        .subscribe(order => {
        // console.log("TCL: CheckoutComponent -> initiatePaymentModal -> order", order)
          var rzp1 = new this.WindowRef.Razorpay(this.preparePaymentDetails(order));
          this.processingPayment = false;
          rzp1.open(); 
          event.preventDefault();
        }, error => {
        console.log("TCL: CheckoutComponent -> initiatePaymentModal -> error", error)

        })

   }


   preparePaymentDetails(order){
   console.log("ShoppingCartComponent -> preparePaymentDetails -> order", order)

    console.log("In preparePaymentDetails");
    var ref = this;
    return  {
      "key": environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      "amount": this.payableAmount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
      "name": 'KSDeveloperStudio',
      "currency": order.currency,
      "order_id": order.id,//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
      "image": 'https://angular.io/assets/images/logos/angular/angular.png',
      "handler": function (response){
        ref.handlePayment(response);
      },
      "prefill": {
          "name": `Angular Geeks`
      },
      "theme": {
          "color": "#2874f0"
      }
     };
   }

   handlePayment(response) {
    console.log("In handlePayment", response);
    this.paymentService.capturePayment({
      amount: this.payableAmount,
      payment_id: response.razorpay_payment_id
    })
      .subscribe(res => {
      console.log("ShoppingCartComponent -> AFTER CAPTURE -> res", res)
        this.paymentResponse = res;
        this.changeRef.detectChanges();
       },
      error => {
        this.paymentResponse = error;
      });
  }

}
