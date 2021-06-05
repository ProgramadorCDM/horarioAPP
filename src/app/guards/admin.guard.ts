import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../core/services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private token: TokenStorageService, private router: Router) {}
  canActivate() {
    if (!!this.token.getToken()) {
      let permitido: boolean = false;
      this.token.getUser().roles.forEach((element) => {
        if (element == 'ROLE_ADMIN') {
          permitido = true;
        }
      });
      if (permitido) {
        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    } else {
      this.router.navigate(['/home']);
      return false;
    }
  }
}
