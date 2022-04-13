/** Interface des filtres applicables */
export interface FiltresI {
  pays?:Array<string>;
  regions?:Array<string>;
  pdo?:Array<string>;
  type?:string;
  ecart?:{debut:number, fin:number};
}
export interface RendementI{
  pays:string;
  regions:string;
  type?:Couleur;
  pdo?:string;
  rendements:Array<number>;
  predictions:Array<number>;
  fiabilites:Array<number>;
}
export class Rendement implements RendementI{
  pays = "";
  regions = "";
  pdo = "";
  type = Couleur.aucun;
  rendements = []; // new Array(40);
  predictions = []; // new Array(11);
  fiabilites = []; // new Array(11);
}
export interface DataI{
  data:Array<RendementI>;
}
export enum Couleur{
  blanc = 'blanc',
  rouge = 'rouge',
  tous = 'tous',
  aucun = ''
}
