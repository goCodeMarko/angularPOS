import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { IProduct } from "../../interfaces/IProduct";
import { ProductsService } from "../../services/product/products.service";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  outputs: [`addToCartEvent`],
  inputs: [`parentData`, `cart`]
})
export class ProductsComponent implements OnInit {
  public addToCartEvent = new EventEmitter();
  public listOfProducts: IProduct[];
  public filteredProducts: IProduct[];
  public selectedProduct: any[] = [];

  public cart: any[];
  public parentData: any[];

  constructor(private _productService: ProductsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._productService.getProducts().subscribe((data: IProduct[]) => { //Gets the data from the service and populats the listOfProducts array.
      this.listOfProducts = data["getProducts"], err => { console.log(err) }

      this._activatedRoute.paramMap.subscribe((params: ParamMap) => { //Reads the parameter.
        let category = params.get('category');

        /*After reading the parameter data will automatically filtered based on 
        selected category then populates the filteredProducts array.*/
        this.filteredProducts = this.listOfProducts.filter(data => {
          if (category == "drinks") {
            return data.category == "drinks";
          } else if (category == "food") {
            return data.category == "food";
          } else if (category == "popular") {
            return data.category == "food" || "drinks";
          } else if (category == "products") {
            return data.category == "food" || "drinks";
          } else {
            this._router.navigate(['/notfound']);
          }

        })

      })

    })
  }

  voidItem() {
    // Gets the data sent by the shop component and looping the id equal to the filteredproducts id and then adds the qty so that the previous qty will be display. 
    this.parentData.forEach(pd => {
      this.filteredProducts.map(fp => {
        if (pd.id == fp._id) {
          fp.qty += pd.qty;
          this.parentData = [];
        }
      })
    })
  }

  addToCart(product): void {
    this.selectedProduct = []; // When addToCart method called the selectedProduct will be cleared to make sure it only handles one object.  

    let prod = [product]; //Putting the object into an array so that I can use array properties.

    //Prompts the quantity input.
    let qty = parseInt(prompt("Enter the Quantity"));

    prod[0].qty = qty  //Adding a "qty" property into the array with the prompts value.

    if (isNaN(qty) || qty <= 0) {
      alert("Invalid Input.");

    } else if (prod[0].onHand < qty) {
      alert("Not Enough Stocks.");

    } else {
      //Gets the total price of the product based on quantity selected.
      prod.map(val => { //Returns a new property called subTotal with the value of results between price * qty 
        return prod[0].subTotal = val.price * val.qty;
      })

      let profit = prod[0].subTotal - (prod[0].cost * prod[0].qty);

      this.selectedProduct.push({ id: prod[0].id, prodName: prod[0].prodName, cost: prod[0].cost, price: prod[0].price, qty: prod[0].qty, subTotal: prod[0].subTotal, profit: profit, });  // Pushing with the selected product data.

      this.subtractQty(prod[0]);

      this.antiDuplicatedItem();

    }
  }

  private subtractQty(onCartQty) {

    this.filteredProducts.map((val) => { //Subtracts the on hand product based on selected qty selected.
      if (val._id === onCartQty.id) {
        return val.qty -= onCartQty.qty;
      }
    })
  }

  private antiDuplicatedItem() {

    if (this.cart.length == 0) { // Checks if cart length is equal to zero, meaning it is the first object so selected product will be emit 
      this.addToCartEvent.emit(this.selectedProduct); //Emits an event with data to be passed at app-products module.

    } else {
      let y = this.cart.filter(val => { //Filters the cart array if current selectedProduct data exists in the cart array.
        if (val.id == this.selectedProduct[0].id) {

          val.qty += this.selectedProduct[0].qty; //Manipulates the cart array data.
          val.subTotal += this.selectedProduct[0].subTotal;

          //Returns an object.
          return val.id == this.selectedProduct[0].id
        }
      })


      if (y.length == 1) { /* Checking the length of variable y, if equal to 1, meaning the product exists in cart array */
        this.addToCartEvent.emit(this.cart); //Emits the cart array.

      } else {
        this.addToCartEvent.emit(this.cart.concat(this.selectedProduct)); // Concatenates both selectedProduct array and cart array, meaning the selected product do not exist in cart array 
      }
    }
  }
}
