import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {UserLdap} from "../../models/user-ldap";
import {MatPaginator} from "@angular/material/paginator";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {UsersService} from "../../service/users.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-ldap-list',
  templateUrl: './ldap-list.component.html',
  styleUrls: ['./ldap-list.component.css']
})
export class LdapListComponent implements OnInit {
  displayedColumns: String[] = ['supprimer', 'nomComplet', 'mail', 'employeNumero'];
  dataSource = new MatTableDataSource<UserLdap>([]);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | null;
  unactiveSelected= false;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private snackBar: MatSnackBar,
    ) {
    this.paginator = null;
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: UserLdap, filter: string) => this.filterPredicate(data, filter);
    this.getUsers();
  }

  private getUsers(): void {
    this.usersService.getUsers().subscribe(
      users => {
        if (this.unactiveSelected) {
          this.dataSource.data = users.filter(user => !user.active);
        } else {
          this.dataSource.data = users;
        }
      }
    )
  }

  filterPredicate(data: UserLdap, filter: string): boolean {
    return !filter || data.nomComplet.toLowerCase().startsWith((filter));
  }

  applyFilter($event: KeyboardEvent): void {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  unactiveChanged($event: MatSlideToggleChange): void {
    this.unactiveSelected = $event.checked;
    this.getUsers();
  }

  edit(id: string): void {
    this.router.navigate(['users/', id]).then((e) =>  {
      if (!e) {
        console.error('Navigation has failed!');
      }
    });
  }

  addUser() {
    this.router.navigate(['/users/add']).then((e) => {
      if (!e) {
        console.log('Navigation has failed!');
      }
    });
  }

  deleteUser(id:number): void {
    this.usersService.deleteUser(id).subscribe({
      next: (value) => {
        this.snackBar.open('Utilisateur supprimé !', 'X');
        this.getUsers();
      },
      error: (err) => {
        console.error('Modification utilisateur', err);
        this.snackBar.open('Utilisateur non supprimé !', 'X');
      }
    });

  }

}
