import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="afAuth.user | async as user; else showLogin">
      <h1>Hello {{ user.displayName }}!</h1>
      <button (click)="logout()">Logout</button>
      <button (click)="idToken()">IDToken</button>
    </div>
    <ng-template #showLogin>
      <p>Please login.</p>
      <button (click)="login()">Login with Google</button>
    </ng-template>
  `,
})
export class AppComponent {
  constructor(public afAuth: AngularFireAuth, private http: HttpClient) {
  }
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  idToken() {
    this.afAuth.auth.currentUser.getIdToken().then((idToken: string) => {
      console.log(idToken);
      this.http.get('http://localhost:8080', {params: {token: idToken}}).subscribe((res: string) => {
        console.log(res);
      });
    });
  }
}
