import { Injectable } from '@angular/core';
import { Router, CanActivate } from "@angular/router";
import { UserService } from "../services/user/user.service";

@Injectable()
export class BasicGuard implements CanActivate {

    constructor(private _userService: UserService,
        private _router: Router) { }

    canActivate() {
        if (this._userService.loggedIn()) {
            return true;
        } else {
            this._router.navigate(['/securedpage']);
        }
    }
} 