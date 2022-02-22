import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtres'
})
export class FiltresPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
