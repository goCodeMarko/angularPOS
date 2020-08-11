import { Component, OnInit } from '@angular/core';
import { TransactionService } from "../../services/transaction/transaction.service";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {
  public cart: any[] = [];
  public itemVoid: any[] = [];
  public transaction: any[] = [];

  public tax: number = 0.12;
  public discountPercentage: number = 0.20;
  public rbtnResult = "regular";

  private changed: number;
  private catchSubTotal: number;
  private grandTotal: number;
  private vat: number;
  private totalDiscount: number = 0;

  constructor(private _transactionService: TransactionService) { }

  ngOnInit(): void {

  }

  calculate(): void {
    //OOP Encapsulation Principle
    this.setSubTotal();
    this.setChargeTax(this.tax);
    this.setGrandTotal();
    this.setDiscount(this.discountPercentage, this.rbtnResult);

  }

  //Setters
  private setSubTotal(): void {
    //Adding each prices of the item in the cart.
    this.catchSubTotal = this.cart.reduce((prev, current) => {
      let result = prev + current.subTotal;
      return parseFloat(result.toFixed(2))

    }, 0)
  }

  private setChargeTax(tax): void {
    //Calculates the VAT.
    let result = this.catchSubTotal * tax;

    this.vat = parseFloat(result.toFixed(2));

    //Calculates the sub total and adding the calculated vat.
    this.grandTotal = this.catchSubTotal + this.vat;
  }

  private setGrandTotal(): void {
    //Calculates the sub total and adding the calculated vat.
    this.grandTotal = this.catchSubTotal + this.vat;
  }

  private setDiscount(discount, rbtnResult) {
    if (rbtnResult == "sc_pwd") {
      //Calculates total discount.
      this.totalDiscount = this.grandTotal * discount;

      this.grandTotal -= this.totalDiscount;
    } else {
      //Calculates previous total if no discount detected.
      this.grandTotal = this.catchSubTotal + this.vat

      //Sets the total discount to zero.
      this.totalDiscount = 0;
    }
  }

  private setChange(cash, total) {
    let result = cash - total;
    this.changed = parseFloat(result.toFixed(2));
  }

  //Getters
  getSubtotal() { //Gets the subtotal.
    return parseFloat(this.catchSubTotal.toFixed(2));
  }

  getChargeTax() { //Gets the tax.
    return parseFloat(this.vat.toFixed(2));
  }

  getDiscount() { //Gets the discount.
    return parseFloat(this.totalDiscount.toFixed(2));
  }

  getGrandTotal() { //Gets the total.
    return parseFloat(this.grandTotal.toFixed(2));
  }

  getChanged() { //Fets the change.
    return parseFloat(this.changed.toFixed(2));
  }

  remove(index, id): void {
    let result: boolean = confirm("Void Selected Item.");

    if (result) {
      /*Filters the cart using the id then setting the itemVoid array
       equal to filtered value and sends this data to the children
       to make the quantity back to the previous value.*/
      this.cart.filter(val => {
        if (val.id === id) {
          this.itemVoid = [val]
        }
      })

      //Removing the selected object from the cart array,
      this.cart.splice(index, 1);
    }
  }

  removeAll(items) {
    let result: boolean = confirm("Void Transaction.");

    if (result) {
      //Sets the objects of cart and to be pass to children component.
      this.itemVoid = items

      //Clears the cart array.
      this.cart = [];
    }
  }

  rbtnChange(value) {
    //Everytime radio button changes the data would update.
    this.rbtnResult = value;
  }

  checkOut(cart, catchSubTotal, vat, totalDiscount, total) {
    let cash = parseInt(prompt("Cash Amount."));
    let changed: number;
    let account: object = JSON.parse(localStorage.getItem('account'));

    if (cash < total && cash >= 0) {
      alert("Insufficient Cash");
    } else if (isNaN(cash) || cash < 0) {
      alert("Invalid Input");
    } else {
      this.setChange(cash, total);

      changed = this.getChanged();

      this.transaction.push(
        {
          user: account["_id"],
          products: cart,
          vatableSales: catchSubTotal,
          vatAmount: vat,
          discount: totalDiscount,
          grandTotal: total,
          cash: cash,
          changed: changed
        }
      );

      this._transactionService.addTransaction(this.transaction[0]).subscribe(data => {

        if (data["success"] == true) {

          alert(
            "VATable Sales: $" + this.transaction[0].vatableSales + "\n" +
            "VAT Amount: $" + this.transaction[0].vatAmount + "\n" +
            "Discount: $" + this.transaction[0].discount + "\n" +
            "Grand Total (Incl. VAT): $" + this.transaction[0].grandTotal + "\n" +
            "Cash: $" + this.transaction[0].cash + "\n" +
            "Changed: $" + this.transaction[0].changed
          );

          alert("Successful Transaction")
        }

      });

      // Clears the cart's data.
      this.cart = [];
    }
  }

}
