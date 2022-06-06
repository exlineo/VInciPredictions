import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Dataset } from 'src/app/utils/modeles/filtres-i';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { Subscription } from 'rxjs';
import { GraphI } from '../utils/modeles/graph-i';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart!:UIChart;

  filtres: Array<string> = []; // Ensemble des filtres appliqués
  l$!: Subscription;
  // Filter form
  filtresForm = this.fbuild.group({
    pays: [[]],
    regions: [[]],
    pdo: [[]],
    rendements: [1981],
    predictions: [2023],
    moyennes: [''],
    croissance: [''],
    type: [''],
    debut: [1983],
    fin: [2032]
  });
  chartType: string = 'line';
  basicOptions: any;
  graphDataset: any = { labels: [1983,1984,1985,1986,1987,1988,1989,1990], datasets: [] };
  /** Portées des années à filtrer */
  pays: Array<any> = []; // List of countries
  infos: boolean = false; // Show / hide infos on click

  constructor(public l: LanguesService, public fbuild: FormBuilder, public store: StoreService) { }

  ngOnInit(): void {
    console.log(this.chart);
    // Loading text page content from database
    this.l.getPage('visualisation');
    // Subscribe to langue to get syncrhonized data
    this.l$ = this.l.t$.subscribe(t => {
      this.pays = [
        { nom: this.l.t['FILTRE_ES'], value: "es" },
        { nom: this.l.t['FILTRE_FR'], value: "fr" },
        { nom: this.l.t['FILTRE_PT'], value: "pt" }
      ];
    }
    );
    // Get last data from Firebase
    this.store.getLastData();
    // Options for charts
    this.basicOptions = {
      plugins: {
        legend: {
          display: false,
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
  ngOnDestroy() {
    this.l$.unsubscribe();
  }
  /** Set data for graph view */
  setGraphData(ev:any) {
    this.store.listes.filtres.forEach(f => {
      // ev.value.forEach(e => console.log(e));
    })
  }
  /** Get average data from countries */
  filtrePays(e:any){
    this.setFiltres(e.value, this.store.listes.pays);
    e.value.forEach((f:string) => {
      this.setDataset(f, this.store.set.moyennes?.pays[f]);
    });
  }
  /** Get average data from regions */
  filtreRegions(e:any){
    this.setFiltres(e.value, this.store.listes.regions);
    e.value.forEach((f:string) => {
      this.setDataset(f, this.store.set.moyennes?.regions[f]);
    });
  }
  /** Get average data */
  filtrePdo(e:any){
    this.setFiltres(e.value, this.store.listes.regions);

  }
  /** Set filters and add data to graph */
  setFiltres(f:Array<string>, ref:Array<string>){
    // Get filters not in filter array
    const l = ref.filter(e => !f.includes(e));
    // Searcing in data to look for old
    this.graphDataset.datasets.forEach((d:any, index:number) => {
      // Transformation en chaîne pour vérifier la présence d'un donnée
      const tmp = JSON.stringify(d);
      // Boucle dans les éléments qui n'apparaissent pas dans la liste
      l.forEach(s => {
        if(tmp.indexOf(s) != -1) this.graphDataset.datasets.splice(index, 1);
      });
    });
    this.chart.refresh();
    console.log(this.graphDataset);
  }
  /** Set dataset */
  setDataset(f:string, d:any){
    const tmp = new Dataset();
    tmp.data = d;
    tmp.label = f;
    if(!this.graphDataset.datasets.includes(tmp)) this.graphDataset.datasets.push(tmp);

    this.chart.refresh();
  }
  /** Valid filters and create chart */
  appliqueFiltres(e: any) {
    console.log(this.filtresForm.value);
    // this.setGraphData();
  }
  /** List accounts */
  // getChartsConfig() {
  //   this.store.getFireDoc('graphes', 'config')
  //     .then(c => c.data())
  //     .then(c => {
  //       // Get data for charts
  //       this.store.getLastData()
  //         .then(
  //           data => data.forEach(
  //             d => console.log(d.data())
  //           )
  //         )
  //         .catch(er => console.log(er));
  //     })
  //     .catch(er => console.log(er));
  // }
}
