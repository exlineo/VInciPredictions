import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { GraphI, GraphSetI } from 'src/app/predictions/utils/modeles/graph-i';
import { isArray } from 'util';
import { FiltresI, RendementI } from '../modeles/filtres-i';

marked.setOptions({
  // renderer: new marked.Renderer(),
  pedantic: false,
  gfm: false,
  headerIds: false,
  breaks: true,
  smartLists: true,
  smartypants: false,
  xhtml: true
});


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
  transform(values: Array<any>, args: any): Array<RendementI> {
    if (!args) return values;
    if (!values) return [];
    // Filters based on Rendement interface
    const data: Array<RendementI> = [];
    values.filter(v => {
      if (args.pdo.indexOf(v.pdo) != -1) {
        data.push(v);
      } else if (args.regions.indexOf(v.regions) != -1) {
        data.push(v);
      } else if (args.pays.indexOf(v.pays) != -1) {
        data.push(v);
      } else if (args.type == v.type.toLowerCase()) {
        data.push(v);
      }
    });
    return data.length > 0 ? data : values;
  }
}
/** Set range for years filters */
@Pipe({
  name: 'ecarts'
})
export class EcartsPipe implements PipeTransform {
  /**
   * Filter wine data
   * @param values Array of data to filter
   * @param args List of arguments send from filter forms
   * @returns Array of wine data
   */
  transform(values: Array<number>, ecart: number, ordre: number = 0): Array<number> {
    if (!ecart) return values;
    if (!values) return [];

    return ordre == 0 ? values.slice(0, ecart) : values.slice(ecart, values.length);
  }
}
/** FIltrer les données Markdown */
@Pipe({
  name: 'md'
})
export class MarkPipe implements PipeTransform {

  transform(value: any): any {
    if (value && value.length > 0) {
      value = value.replaceAll('  ', '\n\n');
      console.log(marked(value));
      // console.log(marked("Pour les professionnels du vin\n\nLe compte vous permet d’accéder aux données de prédiction correspondants à vos besoins. La plateforme vous offre une opportunité d’augmenter vos marges en vous donnant des informations sur la productivité des vignes et les marchés internationaux. La plateforme VInci est votre porte d’entrée vers des outils regroupés vers des organismes de recherche privés et publics.\n\n### Comment procéder ? Remplissez le formulaire ci-contre. Un email de confirmation vous sera transmis pour valider votre adresse email. Vous aurez alors accès aux données gratuites.\n\nUn code peut être saisi. Il vous sera fourni par des organismes tiers pour vous permettre d’accéder à des données complémentaires. Les gestionnaires de la plateforme peuvent prendre l’initiative de désactiver un compte. Un message vous sera transmis si un tel événement devait se produire.\n\n### Les données personnelles Des données personnelles sont nécessaires pour l’accès à la plateforme. Celles-ci sont supprimées avec la suppression du compte utilisateur. Pour plus d&#39;informations, accédez à la page dédiée."), typeof value);
      return marked(value);
    }
    return value;
  }
}
/** FIltrer les données Markdown */
@Pipe({
  name: 'graph'
})
export class GraphPipe implements PipeTransform {

  transform(values: Array<any>, args: any): GraphI {
    if (!args) return <GraphI>{};
    if (!values) return <GraphI>{};

    const FP = new FiltresPipe();
    const data = FP.transform(values, args);
    const vals:GraphI = {labels:[], datasets:[]};

    data.forEach(d => {
      let g = <GraphSetI>{};
      g = {
        label: `${d.regions} (${d.pdo})`,
        data: d.rendements.concat(d.predictions),
        fill: false,
        borderColor: '#42A5F5',
        tension: .4
      };
      // console.log(g);
      vals.datasets.push(g);
    });
    const tmp = data[0].rendements.length + data[0].predictions.length;
    for(let i=0;i<tmp;++i) vals.labels.push((1981+i).toString());

    return vals;
  }
}

