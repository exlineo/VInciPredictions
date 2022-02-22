import { Component, OnInit } from '@angular/core';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit {

  /** Ensemble des filtres appliqués */
  filtres:Array<string> = [];
  /** Options pour la visualisation des données avec echarts */
  options:any = {};
  /** Portées des années à filtrer */
  range:{min:number, max:number}={min:1996, max:2024};

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
  selectRange(e:any, type:string){
    console.log(e.target.value, e.currentTarget.value);
    let val = 1996 + parseInt(e.target.value);
    if(type=='min'){
      if(val >= this.range.max) val = this.range.max -1;
      this.range.min = val;
      e.target.value = val-1997;
    }else{
      if(val <= this.range.min) val = this.range.min +1;
      this.range.max = val;
      e.target.value = val-1995;
    }
  }
}
