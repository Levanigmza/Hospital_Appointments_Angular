import { Component, OnInit  , Output, EventEmitter} from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule, } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserAuthService } from '../../services/user-auth.service';
import { LogoutService } from '../../services/LogoutService';
import { SearchService } from '../../services/SearchService';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule ],
  viewProviders: [UserAuthService, LogoutService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',

})
export class HeaderComponent implements OnInit  {

  @Output() searchQuery: EventEmitter<string> = new EventEmitter<string>();

  userName: string = '';
  user: any;
  public userRole: string | null = null;

  isuserLoggedIn: Boolean = false;
  isDoctorsActive: boolean = false;


  constructor(private router: Router , private route: ActivatedRoute, public authService: UserAuthService, private logoutservice: LogoutService, private searchService: SearchService
  )  {}


  
  ngOnInit() {
   this.getUserStatus();
   this.userRole = this.authService.getUserRole();



  }




  getUserStatus(){
    if(this.authService.isAuthenticated()){
      this.isuserLoggedIn = true;
      this.getUserData();
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isDoctorsActive = event.url === '/doctors';
      }
    });
  
  }


  getUserData() {
    try {
      this.authService.getUserData().subscribe(
        (data) => {
          this.user = data;
          this.userName = this.user.name + " " + this.user.surname;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }



  signOut() {
    this.logoutservice.logout();
    this.authService.clearAuthToken();
    this.isuserLoggedIn = false;
  }

  authorize() {
    this.authService.clearAuthToken();
    this.router.navigate(['/login']);
  }


  Loaduserpage() {
    switch (this.userRole) {
      case 'Admin':
        this.router.navigate(['/administrator']);
        break;
      case 'User':
        this.router.navigate(['/userpage']);
        break;
      case 'Doctor':
        this.router.navigate(['/doctorpage']);
        break;
      default:
        console.log("unknow role");
        break;
    }
  }
  

  register() {
    this.router.navigate(['/register']);
  }


  Mainpage() {
    this.router.navigate(['/']);
  }
  doctors() {
    this.router.navigate(['/doctors']);

  }
  clinics() {
    console.log('Clicked');
  }
  Anotations() {
    console.log('Clicked');
  }
  sales() {
    console.log('Clicked');
  }
  services() {
    console.log('Clicked');
  }
  medicaments() {
    console.log('Clicked');
  }
  contact() {
    console.log('Clicked');
  }


  searchDoctors(searchTerm: string) {

    this.searchService.setSearchTerm(searchTerm);
  }


}

