import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  temperature:any;
  humidity:any;
  pressure:any;
  light:any;
  updatedon:any;
  interval:any;
  constructor(private dataService:DataService) { }

  ngOnInit() {
    this.getlatestData();
    this.interval = setInterval(() => { 
      this.getlatestData(); 
  }, 5000);
  }
  getlatestData(){
    this.dataService.getLatestData().subscribe(data=>{
      if(data.success){
        this.temperature = data.data.temperature;
        this.humidity = data.data.humidity;
        this.pressure = data.data.pressure;
        this.light = data.data.light;
        this.updatedon = data.data.lastupdate
      }
      else{
        this.temperature = 'No Data';
        this.humidity = 'No Data';
        this.pressure = 'No Data';
        this.light = 'No Data';
      }
    })
  }

}
