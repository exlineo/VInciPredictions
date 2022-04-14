export interface ProfilI {
  // fireU?:unknown;
  uid?:string;
  nom:string;
  prenom:string;
  adresse?:string;
  adresse2?:string;
  codePostal?:string;
  ville?:string;
  tel?:string;
  mobile?:string;
  mail:string;
  code?:string; // Code promotionnel éventuel
  droits:Droits;
  statut:number;
}
/** Interface des droits des utilisateurs */
export interface Droits{
  petite:number;
  grande:number;
  export:number;
}
/** Niveau d'accès */
export enum Acces{
  bloque = 0,
  gratuit = 1,
  payant = 2
}
export class Profil implements ProfilI{
  uid = '';
  nom = '';
  prenom = '';
  adresse = '';
  tel = '';
  mobile = '';
  mail = '';
  code = ''; // Code promotionnel éventuel
  droits = {petite:0, grande:0, export:0};
  statut = 0;
}
