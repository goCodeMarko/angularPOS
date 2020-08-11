import { Component, OnInit } from '@angular/core';
import { TransactionService } from "../../services/transaction/transaction.service";
import { ITransaction } from "../../interfaces/ITransaction";

@Component({
  selector: 'app-generalsales',
  templateUrl: './generalsales.component.html',
  styleUrls: ['./generalsales.component.css']
})
export class GeneralsalesComponent implements OnInit {

  constructor(private _transactionService: TransactionService) { }
  public generalSales: any[] = [];
  public filteredGeneralSales: any[] = []
  public total: number = 0;
  public profit: number = 0;

  ngOnInit(): void {
    let date = new Date();
    let dateToday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    this._transactionService.getTransaction().subscribe(data => {
      let trans: ITransaction[] = data["getTransactions"];

      trans.forEach(transaction => {
        transaction.products.forEach(items => {

          this.generalSales.push({
            id: items.id,
            product: items.prodName,
            cost: items.cost,
            price: items.price,
            qty: items.qty,
            total: items.subTotal,
            profit: items.profit,
            date: transaction.dateCreated
          })
        });
      });

      this.filterByDate(dateToday)
    });

  }

  filterByDate(dateRequired) {

    for (var x = 0; x < this.generalSales.length; x++) {
      // Formats the date sent by the user.
      let dateFormat = new Date(this.generalSales[x].date);
      let dateCreated = dateFormat.getFullYear() + '-' + (dateFormat.getMonth() + 1) + '-' + dateFormat.getDate();

      // Filtering the product list based on the user selected date.
      if (dateCreated == dateRequired) {

        // Checks if the data exist in filteredGeneralSales Array.
        let duplicatedData = this.filteredGeneralSales.filter(data => {

          // If exist the qty, total, and profit will be increment based on duplicated product information.
          if (data.product == this.generalSales[x].product) {
            data.qty += this.generalSales[x].qty;
            data.total += this.generalSales[x].total;
            data.profit += this.generalSales[x].profit;

            //variable duplicatedData will return an Object.
            return data.product == this.generalSales[x].product;
          }
        });

        // If the length of the variable duplicatedData is zero thats means the product is not yet in the array, so it will be inserted.
        if (duplicatedData.length == 0) {
          this.filteredGeneralSales.push(this.generalSales[x]);
        }

        // Everytime the item inserted to the array, variable total and prodit will automatically calculates the latest data.
        this.total += this.generalSales[x].total;
        this.profit += this.generalSales[x].profit;

      }
    }
  }
}

