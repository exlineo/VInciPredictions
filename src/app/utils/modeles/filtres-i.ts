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
export interface MoyennesI{
  pays: any;
  regions: any;
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
  creeLe?:CreeI;
  data:Array<RendementI>;
  filtres?:{ pays: Array<string>, regions: Array<string>, pdo: Array<string> };
  moyennes?:MoyennesI;
}
export interface CreeI{
  time?:number;
  collection?:string;
}
export interface DatasetI{
  label: string,
  fill: boolean,
  borderColor: string,
  yAxisID: string,
  tension: number,
  data: Array<number>;
}
export class Dataset implements DatasetI{
  label = '';
  fill = false;
  borderColor = '#42A5F5';
  yAxisID = 'y';
  tension = .4;
  data = [];
}
export enum Couleur{
  blanc = 'blanc',
  rouge = 'rouge',
  tous = 'tous',
  aucun = ''
}
