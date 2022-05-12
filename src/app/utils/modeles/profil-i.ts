import { UserI } from "./user-i";

export interface ProfilI {
  nom:string;
  prenom:string;
  adresse?:string;
  adresse2?:string;
  codePostal?:string;
  ville?:string;
  pays?:string;
  tel?:string;
  mobile?:string;
  code?:string; // Code promotionnel éventuel
  droits:Droits;
  statut:number;
  u:UserI;
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
  nom = '';
  prenom = '';
  adresse = '';
  adresse2 = '';
  tel = '';
  mobile = '';
  pays = '';
  mail = '';
  code = ''; // Code promotionnel éventuel
  droits = {petite:0, grande:0, export:0};
  statut = 0;
  u = {}
}
