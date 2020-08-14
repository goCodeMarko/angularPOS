import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction/transaction.service';
import { ITransaction } from "../../interfaces/ITransaction";

@Component({
  selector: 'app-dailysales',
  templateUrl: './dailysales.component.html',
  styleUrls: ['./dailysales.component.css']
})
export class DailysalesComponent implements OnInit {
  public dailySales: any[] = [];
  public dailySalesCopy: any[] = [];
  public filteredDailySales: any[] = [];

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

          this.dailySales.push({
            id: transaction._id,
            product: items.prodName,
            staff: `${transaction.user["fname"]} ${transaction.user["lname"]}`,
            date: transaction.dateCreated,
            cost: items.cost,
            price: items.price,
            qty: items.qty,
            total: items.subTotal,
            profit: items.profit
          });

          this.dailySalesCopy.push({
            id: transaction._id,
            product: items.prodName,
            staff: `${transaction.user["fname"]} ${transaction.user["lname"]}`,
            date: transaction.dateCreated,
            cost: items.cost,
            price: items.price,
            qty: items.qty,
            total: items.subTotal,
            profit: items.profit
          })

        });
      });

      this.filter();
    });

  }

  filter() {
    // Clears the filteredGeneralArray to make sure array containes nothing everytime the method has been called.
    this.filteredDailySales.length = 0;

    if (this.dailySales.length == 0) {
      this.dailySalesCopy.forEach(transaction => {
        this.dailySales.push({
          id: transaction.id,
          product: transaction.product,
          staff: transaction.staff,
          date: transaction.date,
          cost: transaction.cost,
          price: transaction.price,
          qty: transaction.qty,
          total: transaction.total,
          profit: transaction.profit
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

      for (var i = 0; i < this.dailySales.length; i++) {
        let transactionDate = new Date(this.dailySales[i].date);

        // Filtering the product list based on the user selected date.
        if (transactionDate >= startDate && transactionDate <= endDate) {


          this.filteredDailySales.push(this.dailySales[i]);


          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.dailySales[i].total;
          this.profit += this.dailySales[i].profit;

        }
      }
    } else if (filterBy == "product") {

      for (var i = 0; i < this.dailySales.length; i++) {
        let transactionDate = new Date(this.dailySales[i].date);

        if (transactionDate >= startDate && transactionDate <= endDate && this.dailySales[i].product.toLowerCase().replace(/ /g, '') == this.filterValue.toLowerCase().replace(/ /g, '')) {


          this.filteredDailySales.push(this.dailySales[i]);


          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.dailySales[i].total;
          this.profit += this.dailySales[i].profit;

        }
      }
    } else if (filterBy == "id") {

      for (var i = 0; i < this.dailySales.length; i++) {
        let transactionDate = new Date(this.dailySales[i].date);

        if (transactionDate >= startDate && transactionDate <= endDate && this.dailySales[i].id.toLowerCase() == this.filterValue.toLowerCase()) {

          this.filteredDailySales.push(this.dailySales[i]);

          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.dailySales[i].total;
          this.profit += this.dailySales[i].profit;

        }
      }
    } else if (filterBy == "cost") {

      for (var i = 0; i < this.dailySales.length; i++) {
        let transactionDate = new Date(this.dailySales[i].date);

        if (transactionDate >= startDate && transactionDate <= endDate && this.dailySales[i].cost == parseFloat(this.filterValue)) {

          this.filteredDailySales.push(this.dailySales[i]);

          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.dailySales[i].total;
          this.profit += this.dailySales[i].profit;

        }
      }
    } else if (filterBy == "price") {

      for (var i = 0; i < this.dailySales.length; i++) {
        let transactionDate = new Date(this.dailySales[i].date);

        if (transactionDate >= startDate && transactionDate <= endDate && this.dailySales[i].price == parseFloat(this.filterValue)) {

          this.filteredDailySales.push(this.dailySales[i]);

          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.dailySales[i].total;
          this.profit += this.dailySales[i].profit;

        }
      }
    } else if (filterBy == "staff") {

      for (var i = 0; i < this.dailySales.length; i++) {
        let transactionDate = new Date(this.dailySales[i].date);

        if (transactionDate >= startDate && transactionDate <= endDate && this.dailySales[i].staff.toLowerCase().replace(/ /g, '') == this.filterValue.toLowerCase().replace(/ /g, '')) {

          this.filteredDailySales.push(this.dailySales[i]);

          // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
          this.total += this.dailySales[i].total;
          this.profit += this.dailySales[i].profit;

        }
      }

      this.dailySales.length = 0
    }
  }
}



