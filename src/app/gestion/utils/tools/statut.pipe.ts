import { Pipe, PipeTransform } from '@angular/core';
/** Translate statut */
@Pipe({
  name: 'tradStatut'
})
export class StatutPipe implements PipeTransform {

  transform(statut: number): string {
    let trad:string = '';
    switch(statut){
      case 7:
        trad = 'STATUT_GRATUIT'
        break;
      case 6:
        trad = 'STATUT_PAYANT'
        break;
      default:
        trad = 'STATUT_BLOQUE'
        break;
    }
    return trad;
  }
}
/** Translate access */
@Pipe({
  name: 'tradAcces'
})
export class AccesPipe implements PipeTransform {

  transform(statut: number): string {
    let trad:string = '';
    switch(statut){
      case 77:
        trad = 'STATUT_ADMIN'
        break;
      case 666:
        trad = 'STATUT_SU'
        break;
      default:
        trad = 'STATUT_IDENTIFIE'
        break;
    }
    return trad;
  }
}
/** Set UI on input range from data */
@Pipe({
  name: 'setState'
})
export class SetStatePipe implements PipeTransform {

  transform(statut: number): string {
    let classe:string = '';
    switch(statut){
      case 0:
        classe = 'bloque';
        break;
      case 1:
      case 77:
        classe = 'identifie';
        break;
      case 2:
      case 666:
        classe = 'ok';
        break;
    }
    return classe;
  }
}
