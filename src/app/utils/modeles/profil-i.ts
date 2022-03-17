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
  droits?:Droits;
  statut:number;
}
/** Interface des droits des utilisateurs */
export interface Droits{
  petite:Access;
  grande:Access;
  export:Access;
}
/** Niveau d'accès */
export enum Access{
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
  droits = {petite:Access.bloque, grande:Access.bloque, export:Access.bloque};
  statut = 0;
}
