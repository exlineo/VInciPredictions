import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
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
    let data: Array<RendementI> = [];
    values.filter(v => {
      if (v.pdo.toLowerCase() == args.pdo.toLowerCase() && args.pdo.length > 0) {
        data.push(v);
      } else if (v.regions.toLowerCase() == args.regions.toLowerCase() && args.regions.length > 0) {
        data.push(v);
      } else if (v.pays.toLowerCase() == args.pays.toLowerCase() && args.pays.length > 0) {
        data.push(v);
      }
      if (v.type.toLowerCase() == args.type.toLowerCase() && args.type.length > 0) {
        data.push(v);
      }
    });
    return data.length > 0 ? data : values;
  }
}
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
