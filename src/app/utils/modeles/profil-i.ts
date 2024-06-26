import { User } from "firebase/auth";
import { UserI } from "./user-i";

export interface ProfilI {
  nom:string;
  prenom:string;
  organisation?:string;
  adresse?:string;
  adresse2?:string;
  codePostal?:string;
  ville?:string;
  pays?:string;
  tel?:string;
  mobile?:string;
  code?:string; // Code promotionnel éventuel
  droits:DroitsI;
  statut:number;
  u:User;
}
/** Interface des droits des utilisateurs */
export interface DroitsI{
  petite:number;
  grande:number;
  export:number;
}
/** Create en empty profil */
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
  droits = {petite:1, grande:1, export:1};
  statut = 0;
  u = <User>{}
}
