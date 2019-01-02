import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http:Http) { }
  getData(){
    return this.http.get('http://api.<yourwebsite>.com/data/<subcription key>')
    .map(res => res.json());
  }
  getLatestData(){
    return this.http.get('http://api.<yourwebsite>.com/data/<subcription key>/latest')
    .map(res => res.json());
  }
}
