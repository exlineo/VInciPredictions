import { Component, OnInit } from '@angular/core';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit {

  filtres:Array<string> = [];
  options:any = {};
  idx = 1;

  constructor(public l:LanguesService) { }

  ngOnInit(): void {
    const xAxisData = [];
    const data1 = [];
    const data2 = [];

    for (let i = 0; i < 100; i++) {
      xAxisData.push('category' + i);
      data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
      data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }

    this.options = this.options = {
      legend: {
        data: ['Bordeaux', 'Sud-ouest'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: xAxisData,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          name: 'Bordeaux',
          type: 'bar',
          data: data1,
          animationDelay: (idx:number) => idx * 10,
        },
        {
          name: 'Sud-ouest',
          type: 'bar',
          data: data2,
          animationDelay: (idx:number) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx:number) => idx * 5,
    };
  }
  /** Sélection des années sur le slider */
  selectRange(e:any){
    console.log(e.target, e.currentTarget);
  }
}
