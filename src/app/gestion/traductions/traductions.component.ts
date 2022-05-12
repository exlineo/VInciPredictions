import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageI } from 'src/app/utils/modeles/page-i';
import { LanguesService } from 'src/app/utils/services/langues.service';

@Component({
  selector: 'app-traductions',
  templateUrl: './traductions.component.html',
  styleUrls: ['./traductions.component.css']
})
export class TraductionsComponent implements OnInit {

  pages:Array<string> = [];
  lang:string = 'fr';

  editPage = this.fbuild.group({
    titre:[''],
    contenu:['']
  });

  editTrad = this.fbuild.group({
    langue:[this.lang],
    data:[[]]
  });
  // Parameters for page edit
  pageId:string = ''; // Page to edit
  page:PageI = <PageI>{};
  pageEdit:PageI = <PageI>{};
  trad:any = {};
  tradEdit:any = {};

  constructor(public l:LanguesService, public fbuild:FormBuilder) { }

  ngOnInit(): void {
    /** Get liste of all pages contents */
    this.l.store.getFireCol(this.lang)
      .then(d => {d.forEach(
        f => {
          this.pages.push(f.id);
        }
      );
      console.log(this.pages);
    });
  }
  /**
   * Set language to edit
   * @param {string} lang Language of texts to edit
   */
  setLang(lang:string){
    this.lang = lang;
  }
  /**
   * Get the page to translate
   */
  selectPage(ev:any, p:string){
    this.pageId = p;

    this.l.store.getFireDoc(this.lang, p)
    .then(p => p.data() as PageI)
    .then(p => {
      console.log(p);
      this.page = p;
    })
    .catch(er => console.log(er));
  }
  /**
   * Select traduction
   */
  selectTrad(){
    this.pageId = '';
    this.page = <PageI>{};
    this.pageEdit = <PageI>{};
    // Get data from database
    this.l.store.getFireDoc('traductions', this.lang)
    .then(t => t.data())
    .then(t => {
      console.log(t);
      this.tradEdit = t;
    })
    .catch(er => console.log(er));
  }
}
