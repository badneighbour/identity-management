import {Component} from '@angular/core';
import {LdapDetailsComponent} from "../ldap-details/ldap-details.component";
import {FormBuilder} from "@angular/forms";
import {UsersService} from "../service/users.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-ldap-edit',
  templateUrl: '../ldap-details/ldap-details.component.html',
  styleUrls: ['../ldap-details/ldap-details.component.css']
})
export class LdapEditComponent extends LdapDetailsComponent{

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    fb: FormBuilder,
    router: Router,
    private snackBar: MatSnackBar)  {
    super(false, fb, router);
  }

  ngOnInit(): void {
    super.onInit();
    this.getUser();
  }

  validateForm(): void {
    console.log('LdapEditComponent - validateForm');
    this.usersService.updateUser(this.getUserFromFormControl()).subscribe({
      next: (value) => {
        this.processValidateRunning = false;
        this.errorMessage = '';
        this.snackBar.open('Utilisateur modifié !', 'X');
      },
      error: (err) => {
        this.processValidateRunning = false;
        this.errorMessage = "Une erreur est survenue dans la modification !";
        console.error('Modification utilisateur', err);
        this.snackBar.open('Utilisateur non modifié !', 'X');
      }
    });
  }

  private getUser(): void {
    const login = this.route.snapshot.paramMap.get('id');

    if (login === null) {
      console.error("Can't retrieve user id from URL");
      return;
    }

    this.usersService.getUser(login).subscribe({
    next: (user) => {
      this.user = user;
      this.copyUserToFormControl();
      console.log('LdapEdit getUser', user);
    },
    error: (err) => {
      this.processValidateRunning = false;
      this.errorMessage = "L'utilisateur n'existe pas !";
      console.error("Obtention utilisateur", err);
      this.snackBar.open("Utilisateur non trouvé !", 'X');
    }
  });
  }



}