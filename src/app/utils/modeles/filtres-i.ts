/** Interface des filtres applicables */
export interface FiltresI {
  pays?:string;
  region?:string;
  type?:string;
  pdo?:string;
  annees?:Array<number>;
}
export interface RendementI{
  pays:string;
  region:string;
  type?:string;
  pdo:string;
  rendements:Array<number>;
  prediction:Array<number>;
  indicateurs:Array<number>;
}
export class Rendement implements RendementI{
  pays = "";
  region = "";
  type = "";
  pdo = "";
  rendements = []; // new Array(40);
  prediction = []; // new Array(11);
  indicateurs = []; // new Array(11);
}
