import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
  @ViewChild('chart', { static: false }) chartrd!: UIChart; // HTML Chart for yields
  @ViewChild('average', { static: false }) chartAvrd!: UIChart; // HTML Chart for aveage yields
  @ViewChild('growth', { static: false }) chartGrowthrd!: UIChart; // HTML Chart for growth
  @ViewChild('chartPredictions', { static: false }) chartpr!: UIChart; // HTML Chart for predictions
  @ViewChild('growthPredictions', { static: false }) chartGrowthpr!: UIChart; // HTML Chart for growth predictions
  // @ViewChild('averagePredictions') chartAvpr!: UIChart;

  @ViewChild('chartB', { static: false }) chartrdB!: UIChart; // HTML Chart for yields
  @ViewChild('averageB', { static: false }) chartAvrdB!: UIChart; // HTML Chart for aveage yields
  @ViewChild('growthB', { static: false }) chartGrowthrdB!: UIChart; // HTML Chart for growth
  @ViewChild('chartPredictionsB', { static: false }) chartprB!: UIChart; // HTML Chart for predictions
  @ViewChild('growthPredictionsB', { static: false }) chartGrowthprB!: UIChart; // HTML Chart for growth predictions

  l$!: Subscription; // Subscribe to translation loading
  config$!: Subscription; // Subscribe to configuration loading observable
  infos: boolean = false; // Show / hide infos on click
  sudoe:boolean = true; // Showing SUDOE's data or Bordeaux's data

  min:number = 0;
  max:number = 100;

  constructor(public l: LanguesService, public fbuild: FormBuilder, public store: StoreService, public visual: VisualService, private changeUI:ChangeDetectorRef) { }

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
      this.visual.chartOp.PR = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'right');
      this.visual.chartOp.RD = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'left');
      this.visual.chartOp.PRB = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'right', 0, 100);
      this.visual.chartOp.RDB = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'right', 0, 100);
      this.visual.chartOp.left = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'left');
      this.visual.chartOp.right = options(this.visual.l.t['FORM_ANNEES'], this.visual.l.t['FORM_RENDEMENTS'], false, 'right');
    }
    );
    /** Get config and   */
    this.config$ = this.store.config$.subscribe(c => {
      // Get last version of data from database
      this.store.getLastSudoe();
    });
  };
  /** Get HTML ELements */
  ngAfterViewInit(){
    console.log(this.chartrdB, this.chartrd);
    // Get list of charts to refresh
    this.visual.chartsEls = [this.chartrd, this.chartAvrd, this.chartGrowthrd, this.chartpr, this.chartGrowthpr];
  }
  // ======================= FORMS INTERACTIONS =====================
  /** Get data from countries selected countries
   * @param {event} e Event send from HTML
  */
  filtrePays(e: any) {
    this.visual.listes.pays = e.value;
    this.visual.filtrePlages();
    this.setMinMax();
  }
  /** Get data from selected regions
   * @param {event} e Event send from HTML
   */
  filtreRegions(e: any) {
    this.visual.listes.regions = e.value;
    this.visual.filtrePlages();
    this.setMinMax();
  }
  /** Get PDO */
  filtrePdo() {
    this.sudoe ? this.visual.filtrePdo() : this.visual.filtreBordeauxPdo();
    this.setMinMax();
  }
  setMinMax(){
    this.min = Math.floor(Math.min(this.visual.DATA.RD));
    this.max = Math.ceil(Math.max(this.visual.DATA.RD));
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
        case 'chartB':
        this.visual.imgDownloadStats(this.chartrdB, 'yields.png');
        break;
      case 'chartPredictionsB':
        this.visual.imgDownloadStats(this.chartprB, 'yieldsPredictions.png');
        break;
      case 'averageB':
        this.visual.imgDownloadStats(this.chartAvrdB, 'averages.png');
        break;
      case 'averagePredictionsB':
        this.visual.imgDownloadStats(this.chartAvrdB, 'averagesPredictions.png');
        break;
      case 'growthB':
        this.visual.imgDownloadStats(this.chartGrowthrdB, 'growths.png');
        break;
      case 'growthPredictionsB':
        this.visual.imgDownloadStats(this.chartGrowthprB, 'growthPredictions.png');
        break;
    };
  }
  /** Panes to show SUDOE data or Bordeaux */
  showSudoe(){
    this.sudoe = true;
    this.changeUI.detectChanges();
    this.visual.chartsEls = [this.chartrd, this.chartAvrd, this.chartGrowthrd, this.chartpr, this.chartGrowthpr];
  }
  showBordeaux(){
    this.sudoe = false;
    console.log("ChartsBEls", this.chartrdB, this.visual.chartsBEls.length );
    this.changeUI.detectChanges();
    this.visual.chartsBEls = [this.chartrdB, this.chartAvrdB, this.chartGrowthrdB, this.chartprB, this.chartGrowthprB];
    if(this.store.lastBordeaux.length == 0) this.store.getLastBordeaux();
  }
  /** Clear observable on navigation change to avoid data overload */
  ngOnDestroy() {
    this.l$.unsubscribe();
    this.config$.unsubscribe();
  }
}
