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
  min?:number;
  max?:number;
  rendements:Array<number>;
  predictions:Array<number>;
  fiabilites:Array<number>;
}
export interface ZonesI{
  pays:any; // List of countries averages
  regions:any; // List of regions averages
}
export interface YieldI{
  RD:any; // Array of yields
  PR:any; // Array of predictions
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
  sudoe:Array<RendementI>;
  bordeaux:Array<RendementI>;
  filtres?:{ pays: Array<string>, regions: Array<string>, pdo: Array<string> };
  zones:ZonesI;
}
export interface CreeI{
  time?:number; // Timestamp
  collection?:string; // name of the set (collection) in Firebase
}
export interface DatasetI{
  label: string,
  fill?: boolean,
  borderColor?: string,
  backgroundColor?:string,
  yAxisID?: string,
  tension?: number,
  data: Array<any>;
}
export class Dataset implements DatasetI{
  label = '';
  fill = false;
  borderColor = '#42A5F5';
  backgroundColor = '#42A5F5';
  yAxisID = 'y';
  tension = .4;
  data = <Array<any>>[];
}
export enum Couleur{
  blanc = 'blanc',
  rouge = 'rouge',
  tous = 'tous',
  aucun = ''
}
export interface ChartI{
  labels:Array<number>;
  datasets:Array<DatasetI>;
}
export class Chart implements ChartI {
  labels = [];
  datasets = [];
}
export interface ConfigI {
  couleurs: any;
  predictions: { debut: number, fin: number };
  fiabilites: { debut: number, fin: number };
  rendements: { debut: number, fin: number };
  contact: string;
  cle: string;
  liens: { petite:string, grande:string };
  version:number
}
export class Config implements ConfigI {
  couleurs = {};
  predictions = { debut: 2022, fin: 2023 };
  fiabilites = { debut: 2020, fin: 2023 };
  rendements = { debut: 1981, fin: 2021 };
  contact = '';
  cle = '';
  liens = { petite: '', grande: '' };
  version = 0.9
}
