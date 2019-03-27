import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Users } from 'src/app/models/Users';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  responsemessage: any = null;
  loading = false;
  users: Users;

  constructor(private service: UserService) { }

  ngOnInit() {
    this.service.getContent()
    .subscribe(
      (response: Response) => {
        console.log(response);
        this.loading = false;
        this.users = response.UserList;

        console.log(this.users);

      }, error => {
        console.log(error.stats)

        if (error.status === 401) {
          this.responsemessage = 'User not authorized!';
        } else {
          console.log(error);
          this.responsemessage = error;
        }
        this.loading = false;
    });
  }

}
