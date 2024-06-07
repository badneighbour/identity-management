import {Router} from '@angular/router';
import {AuthenticationService} from "./authentication.service";
import {inject} from "@angular/core";

export const AuthGuard = () => {
  const router = inject(Router);

  if (!AuthenticationService.isLoggedIn()) {
    router.navigate(['login']).then((e) => {
      if (!e) {
        console.log('Navigation has failed!');
      }
    });
    return false;
  }
  return true;
}
