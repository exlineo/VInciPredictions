import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { StoreService } from 'src/app/utils/services/store.service';
import { Subscription } from 'rxjs';
import { UIChart } from 'primeng/chart';
import { options } from '../utils/chartOptions';
import { VisualService } from '../utils/services/visual.service';

@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit, AfterViewInit, OnDestroy {

  /** Charts */
  @ViewChild('chart') chartrd!: UIChart; // HTML Chart for yields
  @ViewChild('average') chartAvrd!: UIChart; // HTML Chart for aveage yields
  @ViewChild('growth') chartGrowthrd!: UIChart; // HTML Chart for growth
  @ViewChild('chartPredictions') chartpr!: UIChart; // HTML Chart for predictions
  // @ViewChild('averagePredictions') chartAvpr!: UIChart;
  @ViewChild('growthPredictions') chartGrowthpr!: UIChart; // HTML Chart for growth predictions

  l$!: Subscription; // Subscribe to translation loading
  config$!: Subscription; // Subscribe to configuration loading observable
  infos: boolean = false; // Show / hide infos on click
  sudoe:boolean = true; // Showing SUDOE's data or Bordeaux's data

  constructor(public l: LanguesService, public fbuild: FormBuilder, public store: StoreService, public visual: VisualService) { }

  ngOnInit(): void {
    // Loading text page content from database
    this.visual.l.getPage('visualisation');
    // Subscribe to langue to get syncrhonized data and translats text and charts
    this.l$ = this.visual.l.t$.subscribe(t => {
      this.visual.pays = [
        { nom: this.visual.l.t['FILTRE_ES'], value: "es" },
        { nom: this.visual.l.t['FILTRE_FR'], value: "fr" },
        { nom: this.visual.l.t['FILTRE_PT'], value: "pt" }
      ];
      this.visual.chartOp.left = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'left', 0, 100);
      this.visual.chartOp.right = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'right', 0, 100);
      this.visual.chartOp.nu = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false);
      this.visual.chartOp.barLeft = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'left', -100, 500);
      this.visual.chartOp.barRight = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'right', -100, 500);
    }
    );
    /** Get config and   */
    this.config$ = this.store.config$.subscribe(c => {
      // Get last version of data from database
      this.store.getLastData();
    });
  };
  /** Get HTML ELements */
  ngAfterViewInit(){
    // Get list of charts to refresh
    this.visual.chartsEls = [this.chartrd, this.chartAvrd, this.chartGrowthrd, this.chartpr, this.chartGrowthpr];
    console.log(this.visual.chartsEls);
  }
  // ======================= FORMS INTERACTIONS =====================
  /** Get data from countries selected countries
   * @param {event} e Event send from HTML
  */
  filtrePays(e: any) {
    this.visual.listes.pays = e.value;
    this.visual.filtrePlages();
  }
  /** Get data from selected regions
   * @param {event} e Event send from HTML
   */
  filtreRegions(e: any) {
    this.visual.listes.regions = e.value;
    this.visual.filtrePlages();
  }
  /** Get PDO */
  filtrePdo() {
    this.visual.filtrePdo();
  }
  /** Download img */
  downloadStats(el: string) {
    switch (el) {
      case 'chart':
        this.visual.imgDownloadStats(this.chartrd, 'yields.png');
        break;
      case 'chartPredictions':
        this.visual.imgDownloadStats(this.chartpr, 'yieldsPredictions.png');
        break;
      case 'average':
        this.visual.imgDownloadStats(this.chartAvrd, 'averages.png');
        break;
      case 'averagePredictions':
        this.visual.imgDownloadStats(this.chartAvrd, 'averagesPredictions.png');
        break;
      case 'growth':
        this.visual.imgDownloadStats(this.chartGrowthrd, 'growths.png');
        break;
      case 'growthPredictions':
        this.visual.imgDownloadStats(this.chartGrowthpr, 'growthPredictions.png');
        break;
    };
  }
  /** Panes to show SUDOE data or Bordeaux */
  showSudoe(){
    this.sudoe = true;
  }
  showBordeaux(){
    this.sudoe = false;
  }
  /** Clear observable on navigation change to avoid data overload */
  ngOnDestroy() {
    this.l$.unsubscribe();
    this.config$.unsubscribe();
  }
}
