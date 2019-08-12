import { Component } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private fileToUpload: File = null;

  constructor(private httpClient: HttpClient) { }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  handleSingleMultipartUpload() {
    const endpoint = 'http://localhost:8080/singleMultipartUpload';
    const formData: FormData = new FormData();
    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    return this.httpClient
      .post(endpoint, formData)
      .pipe(
        map(() => true),
        catchError((err) => of(err)))
      .subscribe((data) => {
        console.log('upload successful');
      }, error => {
        console.log('error occurred');
      });
  }

  handleSingleMultipartAdditionalContentUpload() {
    const endpoint = 'http://localhost:8080/singleMultipartAdditionalContentUpload';
    const formData: FormData = new FormData();
    formData.append('file', this.fileToUpload, this.fileToUpload.name);
    formData.append('additionalContent', 'This is additional content')
    return this.httpClient
      .post(endpoint, formData)
      .pipe(
        map(() => true),
        catchError((err) => of(err)))
      .subscribe((data) => {
        console.log('upload successful');
      }, error => {
        console.log('error occurred');
      });
  }

  handleBinaryUpload() {
    const endpoint = 'http://localhost:8080/binaryUpload';

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/octet-stream');
    return this.httpClient
      .post(endpoint, this.fileToUpload, { headers: headers})
      .pipe(
        map(() => true),
        catchError((err) => of(err)))
      .subscribe((data) => {
        console.log('upload successful');
      }, error => {
        console.log('error occurred');
      });
  }

  handleBase64Upload() {
    const endpoint = 'http://localhost:8080/base64EncodedUpload';

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    fromPromise(new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (ev: any) => {
        return resolve(btoa(ev.target.result));
      };
      reader.onerror = error => reject(error);
      reader.readAsBinaryString(this.fileToUpload);
    }))
      .pipe(
        switchMap((encoded) => {
          return this.httpClient
            .post(endpoint, {data: encoded, fileName: this.fileToUpload.name}, { headers: headers})
            .pipe(
              map(() => true),
              catchError((err) => of(err)));
        })
      )
      .subscribe((data) => {
        console.log('upload successful');
      }, error => {
        console.log('error occurred');
      });
  }

}
