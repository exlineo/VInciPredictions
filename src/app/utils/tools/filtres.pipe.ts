import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { isArray } from 'util';
import { FiltresI, RendementI } from '../modeles/filtres-i';

@Pipe({
  name: 'filtres'
})
export class FiltresPipe implements PipeTransform {
  /**
   * Filter wine data
   * @param values Array of data to filter
   * @param args List of arguments send from filter forms
   * @returns Array of wine data
   */
   transform(values: Array<any>, args:any): Array<RendementI> {
    if(!args) return values;
    if(!values) return [];

    let data:Array<RendementI> = [];
    for(let a in args){
      data = values.filter(v => {
        console.log(v, v[a]);
        if(v[a] == args[a] || v[a] == args[a]){
          return v;
        }
        // if(typeof args[a] == 'string' && v[a] == args[a]){
        //   return v;
        // }else if(isArray(args[a]) && v.contains(a)){
        //   return v;
        // }
      });
    }

    return data.length > 0 ? data : values;
  }

}
/** FIltrer les données Markdown */
@Pipe({
  name: 'md'
})
export class MarkPipe implements PipeTransform {

  transform(value: any): any {
    if (value && value.length > 0) {
      return marked(value);
    }
    return value;
  }
}
