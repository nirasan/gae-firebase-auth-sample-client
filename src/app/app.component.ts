import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="afAuth.user | async as user; else showLogin">
      <h1>Hello {{ user.displayName }}!</h1>
      <button (click)="logout()">Logout</button>
      <button (click)="accessServer()">Access Server</button>
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
  // Firebase Authentication のログイン実行
  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  // Firebase Authentication のログアウト実行
  logout() {
    this.afAuth.auth.signOut();
  }
  // Firebase Authentication の ID Token をヘッダに付与してサーバーアクセスする
  accessServer() {
    this.afAuth.auth.currentUser.getIdToken().then((idToken: string) => {
      const header = new HttpHeaders().set('Authorization', 'Bearer ' + idToken);
      this.http.get('http://localhost:8080', {headers: header}).subscribe((res: string) => {
        console.log(res);
      });
    });
  }
}
