import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/utils/services/auth.service';
import { LanguesService } from 'src/app/utils/services/langues.service';
import { PromoI } from '../utils/modeles/modeles';
import { PredictionsService } from '../utils/services/predictions.service';

@Component({
  selector: 'app-promo',
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css']
})
export class PromoComponent implements OnInit {

  code!: string;
  promos: Array<any> = []; // List of all promotionnal codes
  infos:boolean = false; // Show informations on page
  add:boolean = false; // Show window to add promotionnal code
  searchForm:any; // Form to filter liste of promos
  accessForm:any; // Form to add levels on codes

  constructor(public l: LanguesService, private fB:FormBuilder, private auth:AuthService, private predServ:PredictionsService) {
    this.searchForm = this.fB.group({search:['']});
    this.accessForm = this.fB.group({
      droits:this.fB.group({
        petite:[1],
        grande:[1],
        export:[1]
      }),
      validite:[true]
    })
  }
  /**
   *
   */
  ngOnInit(): void {
    // Loading text page content from database
    this.l.getPage('promos');
    this.getCodes();
  }
  /** Get list of promotional codes */
  getCodes() {
    this.promos = [];
    this.l.store.getFireCol('promos')
      .then(p => {
        p.forEach(f => {
          // let tmp = f.data();
          // const infos = atob(tmp['code']).split('-');
          // const access = JSON.parse(infos[1]);
          let tmp = <PromoI>{};
          tmp = f.data() as PromoI;
          tmp.id = f.id;
          tmp.droits = this.predServ.getAccessFromCode(f.data()['code']);
          // this.promos.push(f.data());
          this.promos.push(tmp);
          console.log(tmp, typeof tmp.validite);
        });
      })
      .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER_DATA'], 'Pas cool : ' + this.l.t['MSG_ER'] + ' : ' + er));
  }
  /** Generate promotional code
   * UID of admin who generate the code
   * accesses object
   * secret key to validate
  */
  gnCode() {
    console.log(this.auth.u.uid, this.accessForm.value, this.l.store.config.cle);
    return btoa(this.auth.u.uid!) + '-' + btoa(JSON.stringify(this.accessForm.controls.droits.value)) + '-' + btoa(this.l.store.config.cle);
  }
  /** Validate code */
  validCode(code:string){

  }
  /** Add a new promotionnal code to database */
  addPromo(){
    const promo = <PromoI>{};
    promo.code = this.gnCode();
    promo.validite = this.accessForm.controls.validite.value;

    console.log(promo);
    this.predServ.setFireDoc('promos', {uid:this.auth.u.uid + '-' + Date.now(), doc:promo})
    .then(ok => {
      this.l.msg.msgOk(this.l.t['MSG_MAJ']);
      this.promos.push(promo);
    })
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER'], er));
  }
  /**
   *
   * @param id ID of the promotional code to edit
   */
  saveCode(id:string, index:number){
    this.predServ.setFireDoc('promos', {uid:id, doc:this.promos[index]})
    .then(ok => this.l.msg.msgOk(this.l.t['MSG_MAJ']))
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER'], er));
  }
  /**
   * Delte code
   * @param index INdex of the document to delete
   */
  supprCode(id:string, index:number){
    this.predServ.delFireDoc('promos', id)
    .then(ok => {
      this.l.msg.msgOk(this.l.t['MSG_DEL']);
      this.promos.splice(index, 1);
    })
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER'], er));
  }
  /**
   * Copye code in clipboard
   * @param code Code to copy
   */
  copyCode(code:string){
    navigator.clipboard.writeText(code);
    this.l.msg.msgOk(this.l.t['MSG_COPY']);
  }
}
