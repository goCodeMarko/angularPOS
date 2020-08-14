import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UserService } from "../../services/user/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username: string = "";
  public password: string = "";
  public result: string = "";
  public fullname: string = "";

  constructor(private _userService: UserService,
    private _router: Router,
    private _flashMessages: FlashMessagesService) { }

  ngOnInit(): void {
    this._userService.logOut();

  }


  loginSubmit() {

    const user = {
      username: this.username,
      password: this.password
    }

    this._userService.authenticate(user).subscribe(data => {

      if (data["success"] === true) {

        this._userService.storeUserData(data["token"], data["account"]);

        const account = JSON.parse(localStorage.getItem('account'));

        if (account) {
          let mname = account.mname;
          let title;

          if (mname.length > 0) {
            mname = `${account.mname[0]}.`;
          }

          if (account.sex == 1) {
            title = "Mr.";
          } else {
            title = "Mrs.";
          }

          this.fullname = `${title} ${account.fname} ${mname} ${account.lname}`;
        }

        this._router.navigate(['/shop/products']);

        this._flashMessages.show(`<span class="fa fa-grin-wink fa-2x"></span>&nbsp&nbsp${this.fullname} is now online.`, {
          cssClass: 'alert-success',
          timeout: 3000
        })

      } else if (data["success"] === false) {

        if (data["msg"] === "not found") {

          this.result = "Account Does Not Exist";
        } else if (data["msg"] === "invalid password") {

          this.result = "Incorrect Password";
        }
      }
    })
  }
}
