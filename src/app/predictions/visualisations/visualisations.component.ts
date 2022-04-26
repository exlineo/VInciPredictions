import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DataI, RendementI } from 'src/app/utils/modeles/filtres-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit {

  /** Ensemble des filtres appliqués */
  filtres: Array<string> = [];
  filtresForm = this.fbuild.group({
    pays: [''],
    regions: [''],
    pdo: [''],
    rendements: [''],
    moyennes: [''],
    croissance: [''],
    couleur: [''],
    ecart: this.fbuild.group({
      debut: [''],
      fin: ['']
    })
  });
  chartType: string = 'line';
  basicData: any;
  lineStylesData: any;
  basicOptions:any;
  /** Portées des années à filtrer */
  range: { min: number, max: number } = { min: 1996, max: 2024 };

  constructor(public l: LanguesService, public fbuild: FormBuilder, public store: StoreService) {
    this.store.getLastData()
      .then(
        data => data.forEach(
          d => {
            console.log(d.data());
            let ds = d.data() as DataI;
            this.store.dataset = ds.data;
            // Define data for charts
            // this.setChartsSeries();
          }
        )
      )
      .catch(er => console.log(er));
  }

  ngOnInit(): void {
    this.basicData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#42A5F5',
          tension: .4
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#FFA726',
          tension: .4
        }
      ]
    };
    this.lineStylesData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          tension: .4,
          borderColor: '#42A5F5'
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderDash: [5, 5],
          tension: .4,
          borderColor: '#66BB6A'
        },
        {
          label: 'Third Dataset',
          data: [12, 51, 62, 33, 21, 62, 45],
          fill: true,
          borderColor: '#FFA726',
          tension: .4,
          backgroundColor: 'rgba(255,167,38,0.2)'
        }
      ]
    };
    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
  };

  }
  /** Sélection des années sur le slider */
  selectRange(e: any, type: string) {
    console.log(e.target.value, e.currentTarget.value);
    let val = 1996 + parseInt(e.target.value);
    if (type == 'min') {
      if (val >= this.range.max) val = this.range.max - 1;
      this.range.min = val;
      e.target.value = val - 1997;
    } else {
      if (val <= this.range.min) val = this.range.min + 1;
      this.range.max = val;
      e.target.value = val - 1995;
    }
  }
  /** Change chart type */
  setChartType(chart: string) {
    this.chartType = chart;
  }
  /** Valid filters and create chart */
  appliqueFiltres() {
    console.log(this.filtresForm.value);
  }
  /** List accounts */
  getChartsConfig() {
    this.store.getFireDoc('graphes', 'config')
      .then(c => c.data())
      .then(c => {
        // Get data for charts
        this.store.getLastData()
          .then(
            data => data.forEach(
              d => console.log(d.data())
            )
          )
          .catch(er => console.log(er));
      })
      .catch(er => console.log(er));
  }
  /** Chart event click */
  chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }
  /** Chart event hover */
  chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }
}
