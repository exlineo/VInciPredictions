import { DroitsI } from "src/app/utils/modeles/profil-i";

export interface PromoI {
  id:string;
  code?:string;
  droits?:DroitsI;
  validite:boolean;
}
