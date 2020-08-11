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
  public total: number = 0;
  public profit: number = 0;
  constructor(private _transactionService: TransactionService) { }

  ngOnInit(): void {
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

          this.total += items.subTotal;
          this.profit += items.profit;
        });
      });
    });

  }

}
