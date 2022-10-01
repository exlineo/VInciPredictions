import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { PageI } from 'src/app/utils/modeles/page-i';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-traductions',
  templateUrl: './traductions.component.html',
  styleUrls: ['./traductions.component.css']
})
export class TraductionsComponent implements OnInit {
  /** Liste of pages to edit */
  pages:Array<string> = [];
  /** Edition form for software */
  editTradForm = this.fB.group({});
  /** ID of page to edit */
  pageId:string = ''; // Page to edit
  /** Page to edit */
  page:PageI = <PageI>{};
  /** Copy page edited */
  pageEdit:PageI = <PageI>{};
  /** Initial software texts */
  trad:any;
  /** Copy software texts edited */
  tradEdit:any = {};
  infos:boolean = false;
  /** Selected language for translation */
  editLang:string = 'fr';
  /** Edition form for pages content */
  editPageForm = this.fB.group({
    titre:[this.pageEdit.titre],
    contenu:[this.pageEdit.contenu],
    accroche:[this.pageEdit.accroche]
  });

  constructor(public l:LanguesService, public fB:FormBuilder) { }

  /** Get liste of all pages contents from database */
  ngOnInit(): void {
    this.l.store.getFireCol(this.editLang)
      .then(d => {d.forEach(
        f => {
          this.pages.push(f.id);
        }
      );
    });
    // Loading text page content from database
    this.l.getPage('admintraductions');
  }
  /**
   * Set language to edit
   * @param {string} lang Language of texts to edit
   */
  setEditLang(lang:string){
    this.editLang = lang;
    this.pageEdit = {...this.page};
    console.log(this.pageEdit);
  }
  /**
   * Get the page to translate
   */
  selectPage(ev:any, p:string){
    this.pageId = p;
    this.trad = null;
    this.l.store.getFireDoc(this.l.langue, p)
    .then(p => p.data() as PageI)
    .then(p => {
      this.page = p;
      this.setPageEdit();
    })
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER_DATA'], this.l.t['MSG_ER'] +' : '+ er));
  }
  /** Set fields for page edition */
  setPageEdit(){
    this.editPageForm.controls.titre.setValue(this.page.titre);
    this.editPageForm.controls.accroche.setValue(this.page.accroche);
    this.editPageForm.controls.contenu.setValue(this.page.contenu);
  }
  /**
   * Select traduction
   */
  selectTrad(){
    this.pageId = '';
    this.page = <PageI>{};
    this.pageEdit = <PageI>{};
    // Get data from database
    this.l.store.getFireDoc('traductions', this.editLang)
    .then(t => t.data())
    .then(t => {
      this.trad = t;
      this.trad.data = JSON.parse(this.trad.data);
      console.log(this.trad.data);
      this.setTradFormFields();
    })
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER_DATA'], this.l.t['MSG_ER'] +' : '+ er));
  }
  /** Set translation dynamic form fields */
  setTradFormFields(){
    for(let i in this.trad.data){
      const fC = new FormControl(this.trad.data[i], []);
      // this.editTradForm.addControl(i, fC);
      this.editTradForm.setControl(i, fC);
    }
    console.log(this.editTradForm)
  }
  /** Save page edition to database and reset form */
  sendEditPage(){
    this.l.store.setFireDoc(this.editLang, {uid:this.pageId, doc:this.editPageForm.value})
    .then(ok => {
      this.l.msg.msgOk(this.l.t['MSG_MAJ']);
      this.editPageForm.reset();
    })
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER_DATA'], this.l.t['MSG_ER'] +' : '+ er))
  }
  /** Save software's translation */
  sendEditTrad(){
    console.log(this.editTradForm.value);
    this.tradEdit.date = Date.now();
    this.tradEdit.data = this.editTradForm.value;
    this.tradEdit.langue = this.editLang;
    // Save data
    this.l.store.setFireDoc('traductions', {uid:this.editLang, doc:this.tradEdit})
    .then(ok => {
      this.l.msg.msgOk(this.l.t['MSG_MAJ']);
      // this.editTradForm.reset();
      this.trad = this.tradEdit;
      this.tradEdit = {};
    })
    .catch(er => this.l.msg.msgFail(this.l.t['MSG_ER_DATA'], this.l.t['MSG_ER'] +' : '+ er))
  }
}
