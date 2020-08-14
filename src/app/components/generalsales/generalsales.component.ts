import { Component, OnInit } from '@angular/core';
import { TransactionService } from "../../services/transaction/transaction.service";
import { ITransaction } from "../../interfaces/ITransaction";

@Component({
  selector: 'app-generalsales',
  templateUrl: './generalsales.component.html',
  styleUrls: ['./generalsales.component.css']
})
export class GeneralsalesComponent implements OnInit {
  public generalSales: any[] = [];
  public generalSalesCopy: any[] = [];
  public filteredGeneralSales: any[] = [];

  public total: number = 0;
  public profit: number = 0;
  public startDate: string;
  public filterValue: string = ""
  public filterBy: string = "product"


  constructor(private _transactionService: TransactionService) { }

  ngOnInit(): void {
    let forDisplay = new Date();
    let zero;

    (forDisplay.getMonth() + 1) < 10 ? zero = 0 : zero = undefined

    let displayDate = `${forDisplay.getFullYear()}-${zero}${forDisplay.getMonth() + 1}-${forDisplay.getUTCDate()}T00:00:00`;

    this.startDate = displayDate;

    this._transactionService.getTransaction().subscribe(data => {
      let trans: ITransaction[] = data["getTransactions"];

      trans.forEach(transaction => {
        transaction.products.forEach(items => {
          let dateCreated = new Date(transaction.dateCreated)

          this.generalSales.push({
            id: items.id,
            product: items.prodName,
            cost: items.cost,
            price: items.price,
            qty: items.qty,
            total: items.subTotal,
            profit: items.profit,
            date: dateCreated
          })

          this.generalSalesCopy.push({
            id: items.id,
            product: items.prodName,
            cost: items.cost,
            price: items.price,
            qty: items.qty,
            total: items.subTotal,
            profit: items.profit,
            date: dateCreated
          })
        });
      });

      this.filter();
    });

  }

  filter() {
    // Clears the filteredGeneralArray to make sure array containes nothing everytime the method has been called.
    this.filteredGeneralSales.length = 0;

    if (this.generalSales.length == 0) {
      this.generalSalesCopy.forEach(data => {
        this.generalSales.push({
          id: data.id,
          product: data.product,
          cost: data.cost,
          price: data.price,
          qty: data.qty,
          total: data.total,
          profit: data.profit,
          date: data.date
        })
      })
    }

    if (this.filterValue.length == 0) {

      this.selectedFilter(this.startDate, "all");

    } else {
      this.selectedFilter(this.startDate, this.filterBy);
    }

  }

  selectedFilter(date, filterBy) {
    // Using the user chosen start date, the program will automatically compute the end date to make sure all the items is on a certain day.
    let startDate = new Date(date);
    // To make sure it starts from zero;
    this.profit = 0;
    this.total = 0;

    // The startDate gives me a data does not equal to user input, so what I did; in month: +1;
    let endDate = new Date(`${startDate.getFullYear()}/${startDate.getMonth() + 1}/${startDate.getDate()} 11:59 PM`);

    if (filterBy == "all") {
      for (var i = 0; i < this.generalSales.length; i++) {
        console.log('dateCreated', this.generalSales[i].date)
        // Filtering the product list based on the user selected date.
        if (this.generalSales[i].date >= startDate && this.generalSales[i].date <= endDate) {

          // Checks if the data eiist in filteredGeneralSales Array.
          let duplicatedData = this.filteredGeneralSales.filter(data => {

            // If eiist the item will not be added in to the array, otherwise the product qty, total, and profit will be incremented based on product value.
            if (data.product == this.generalSales[i].product) {
              data.qty += this.generalSales[i].qty;
              data.total += this.generalSales[i].total;
              data.profit += this.generalSales[i].profit;

              //variable duplicatedData will return a truthy value.
              return true;
            }
          });

          // If the length of the variable duplicatedData is zero thats means the product is not yet in the array, so it will be inserted.
          if (duplicatedData.length == 0) {
            this.filteredGeneralSales.push(this.generalSales[i]);
          }

          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.generalSales[i].total;
          this.profit += this.generalSales[i].profit;

        }
      }
    } else if (filterBy == "product") {

      for (var i = 0; i < this.generalSales.length; i++) {
        if (this.generalSales[i].date >= startDate && this.generalSales[i].date <= endDate && this.generalSales[i].product.toLowerCase().replace(/ /g, '') == this.filterValue.toLowerCase().replace(/ /g, '')) {

          // Checks if the data eiist in filteredGeneralSales Array.
          let duplicatedData = this.filteredGeneralSales.filter(data => {

            // If eiist the item will not be added in to the array, otherwise the product qty, total, and profit will be incremented based on product value.
            if (data.product == this.generalSales[i].product) {
              data.qty += this.generalSales[i].qty;
              data.total += this.generalSales[i].total;
              data.profit += this.generalSales[i].profit;

              //variable duplicatedData will return a truthy value.
              return true;
            }
          });

          // If the length of the variable duplicatedData is zero thats means the product is not yet in the array, so it will be inserted.
          if (duplicatedData.length == 0) {
            this.filteredGeneralSales.push(this.generalSales[i]);
          }

          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.generalSales[i].total;
          this.profit += this.generalSales[i].profit;

        }

      }
    } else if (filterBy == "id") {

      for (var i = 0; i < this.generalSales.length; i++) {
        if (this.generalSales[i].date >= startDate && this.generalSales[i].date <= endDate && this.generalSales[i].id.toLowerCase() == this.filterValue.toLowerCase()) {

          // Checks if the data eiist in filteredGeneralSales Array.
          let duplicatedData = this.filteredGeneralSales.filter(data => {

            // If eiist the item will not be added in to the array, otherwise the product qty, total, and profit will be incremented based on product value.
            if (data.product == this.generalSales[i].product) {
              data.qty += this.generalSales[i].qty;
              data.total += this.generalSales[i].total;
              data.profit += this.generalSales[i].profit;

              //variable duplicatedData will return a truthy value.
              return true;
            }
          });

          // If the length of the variable duplicatedData is zero thats means the product is not yet in the array, so it will be inserted.
          if (duplicatedData.length == 0) {
            this.filteredGeneralSales.push(this.generalSales[i]);
          }

          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.generalSales[i].total;
          this.profit += this.generalSales[i].profit;

        }

      }
    } else if (filterBy == "cost") {

      for (var i = 0; i < this.generalSales.length; i++) {
        if (this.generalSales[i].date >= startDate && this.generalSales[i].date <= endDate && this.generalSales[i].cost == parseFloat(this.filterValue)) {

          // Checks if the data eiist in filteredGeneralSales Array.
          let duplicatedData = this.filteredGeneralSales.filter(data => {

            // If eiist the item will not be added in to the array, otherwise the product qty, total, and profit will be incremented based on product value.
            if (data.product == this.generalSales[i].product) {
              data.qty += this.generalSales[i].qty;
              data.total += this.generalSales[i].total;
              data.profit += this.generalSales[i].profit;

              //variable duplicatedData will return a truthy value.
              return true;
            }
          });

          // If the length of the variable duplicatedData is zero thats means the product is not yet in the array, so it will be inserted.
          if (duplicatedData.length == 0) {
            this.filteredGeneralSales.push(this.generalSales[i]);
          }

          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.generalSales[i].total;
          this.profit += this.generalSales[i].profit;

        }

      }
    } else if (filterBy == "price") {

      for (var i = 0; i < this.generalSales.length; i++) {
        if (this.generalSales[i].date >= startDate && this.generalSales[i].date <= endDate && this.generalSales[i].price == parseFloat(this.filterValue)) {

          // Checks if the data eiist in filteredGeneralSales Array.
          let duplicatedData = this.filteredGeneralSales.filter(data => {

            // If eiist the item will not be added in to the array, otherwise the product qty, total, and profit will be incremented based on product value.
            if (data.product == this.generalSales[i].product) {
              data.qty += this.generalSales[i].qty;
              data.total += this.generalSales[i].total;
              data.profit += this.generalSales[i].profit;

              //variable duplicatedData will return a truthy value.
              return true;
            }
          });

          // If the length of the variable duplicatedData is zero thats means the product is not yet in the array, so it will be inserted.
          if (duplicatedData.length == 0) {
            this.filteredGeneralSales.push(this.generalSales[i]);
          }

          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.generalSales[i].total;
          this.profit += this.generalSales[i].profit;

        }

      }
    }

    this.generalSales.length = 0
  }
}




