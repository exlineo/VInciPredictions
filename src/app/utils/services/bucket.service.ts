import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage, getDownloadURL, getBlob, getBytes, getStream, uploadBytes, ref } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  constructor(private bucket:Storage, private http:HttpClient) { }

  /** Get file from bucket
   * @param {string} link directories et file to download
  */
   async getMD(link:string){
     console.log(`${environment.bucket}${link}`);
    // this.http.get("https://firebasestorage.googleapis.com/v0/b/vinciplateforme.appspot.com/o/contenus%2Ffr%2Fcompte.md", { responseType: 'text'}).subscribe(
    //   d => console.log(d)
    // );
    // return await fetch("https://firebasestorage.googleapis.com/v0/b/vinciplateforme.appspot.com/o/contenus%2Ffr%2Fcompte.md");
    // return await getDownloadURL(ref(this.bucket, `${environment.bucket}${link}`));
    return await getBlob(ref(this.bucket, `${environment.bucket}${link}`));
    // return await getBytes(ref(this.bucket, `${environment.bucket}${link}`));
    // return await getStream(ref(this.bucket, `${environment.bucket}${link}`));
  }
}
