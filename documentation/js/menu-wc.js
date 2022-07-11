'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">vinci-predictions documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-f67c0c2d3c67a388e80ac7cc645f226a63c10c3846711757108d6f0f20c3ee7539f3e35d04533e4cc774f10007895adef0ba608b27cae00309deba86b4b2d93b"' : 'data-target="#xs-components-links-module-AppModule-f67c0c2d3c67a388e80ac7cc645f226a63c10c3846711757108d6f0f20c3ee7539f3e35d04533e4cc774f10007895adef0ba608b27cae00309deba86b4b2d93b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-f67c0c2d3c67a388e80ac7cc645f226a63c10c3846711757108d6f0f20c3ee7539f3e35d04533e4cc774f10007895adef0ba608b27cae00309deba86b4b2d93b"' :
                                            'id="xs-components-links-module-AppModule-f67c0c2d3c67a388e80ac7cc645f226a63c10c3846711757108d6f0f20c3ee7539f3e35d04533e4cc774f10007895adef0ba608b27cae00309deba86b4b2d93b"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CompteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConnexionComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConnexionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErreurComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ErreurComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MentionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MentionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/OublieComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OublieComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RgpdComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RgpdComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SupportComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SupportComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-f67c0c2d3c67a388e80ac7cc645f226a63c10c3846711757108d6f0f20c3ee7539f3e35d04533e4cc774f10007895adef0ba608b27cae00309deba86b4b2d93b"' : 'data-target="#xs-injectables-links-module-AppModule-f67c0c2d3c67a388e80ac7cc645f226a63c10c3846711757108d6f0f20c3ee7539f3e35d04533e4cc774f10007895adef0ba608b27cae00309deba86b4b2d93b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-f67c0c2d3c67a388e80ac7cc645f226a63c10c3846711757108d6f0f20c3ee7539f3e35d04533e4cc774f10007895adef0ba608b27cae00309deba86b4b2d93b"' :
                                        'id="xs-injectables-links-module-AppModule-f67c0c2d3c67a388e80ac7cc645f226a63c10c3846711757108d6f0f20c3ee7539f3e35d04533e4cc774f10007895adef0ba608b27cae00309deba86b4b2d93b"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LanguesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LanguesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GestionModule.html" data-type="entity-link" >GestionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GestionModule-c3c80b7a3218280ab7fd640fc4cb40d81389220dd6a42bb77ce04c582a89ac35eef887dadbb24e34557561db1d7d2f78d4f2a4e6f186d7e41710aac477fbc780"' : 'data-target="#xs-components-links-module-GestionModule-c3c80b7a3218280ab7fd640fc4cb40d81389220dd6a42bb77ce04c582a89ac35eef887dadbb24e34557561db1d7d2f78d4f2a4e6f186d7e41710aac477fbc780"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GestionModule-c3c80b7a3218280ab7fd640fc4cb40d81389220dd6a42bb77ce04c582a89ac35eef887dadbb24e34557561db1d7d2f78d4f2a4e6f186d7e41710aac477fbc780"' :
                                            'id="xs-components-links-module-GestionModule-c3c80b7a3218280ab7fd640fc4cb40d81389220dd6a42bb77ce04c582a89ac35eef887dadbb24e34557561db1d7d2f78d4f2a4e6f186d7e41710aac477fbc780"' }>
                                            <li class="link">
                                                <a href="components/AdminAccueilComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminAccueilComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DataMajComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataMajComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfilsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TraductionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TraductionsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-GestionModule-c3c80b7a3218280ab7fd640fc4cb40d81389220dd6a42bb77ce04c582a89ac35eef887dadbb24e34557561db1d7d2f78d4f2a4e6f186d7e41710aac477fbc780"' : 'data-target="#xs-pipes-links-module-GestionModule-c3c80b7a3218280ab7fd640fc4cb40d81389220dd6a42bb77ce04c582a89ac35eef887dadbb24e34557561db1d7d2f78d4f2a4e6f186d7e41710aac477fbc780"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-GestionModule-c3c80b7a3218280ab7fd640fc4cb40d81389220dd6a42bb77ce04c582a89ac35eef887dadbb24e34557561db1d7d2f78d4f2a4e6f186d7e41710aac477fbc780"' :
                                            'id="xs-pipes-links-module-GestionModule-c3c80b7a3218280ab7fd640fc4cb40d81389220dd6a42bb77ce04c582a89ac35eef887dadbb24e34557561db1d7d2f78d4f2a4e6f186d7e41710aac477fbc780"' }>
                                            <li class="link">
                                                <a href="pipes/AccesPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccesPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SetStatePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SetStatePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/StatutPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatutPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GestionRoutingModule.html" data-type="entity-link" >GestionRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PredictionsModule.html" data-type="entity-link" >PredictionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PredictionsModule-d9505affef6142fbe87c49c0fc7712aff56bdee50250534f934a5208e1398e7a78a566891f4d93273d8245105d46bc7ef90dfd340f2dac34b99c1815f84a0e0b"' : 'data-target="#xs-components-links-module-PredictionsModule-d9505affef6142fbe87c49c0fc7712aff56bdee50250534f934a5208e1398e7a78a566891f4d93273d8245105d46bc7ef90dfd340f2dac34b99c1815f84a0e0b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PredictionsModule-d9505affef6142fbe87c49c0fc7712aff56bdee50250534f934a5208e1398e7a78a566891f4d93273d8245105d46bc7ef90dfd340f2dac34b99c1815f84a0e0b"' :
                                            'id="xs-components-links-module-PredictionsModule-d9505affef6142fbe87c49c0fc7712aff56bdee50250534f934a5208e1398e7a78a566891f4d93273d8245105d46bc7ef90dfd340f2dac34b99c1815f84a0e0b"' }>
                                            <li class="link">
                                                <a href="components/AccueilComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccueilComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfilComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VisualisationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VisualisationsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PredictionsRoutingModule.html" data-type="entity-link" >PredictionsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UtilsModule.html" data-type="entity-link" >UtilsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UtilsModule-4c92583d1c891addab293a48e8fed9fbb55269317ebd2fa485a2d76c4b763ac7d1c99e57e3f8ac69a94bd190427205b36905efba6f8a9513c5b034c5ccb9f334"' : 'data-target="#xs-components-links-module-UtilsModule-4c92583d1c891addab293a48e8fed9fbb55269317ebd2fa485a2d76c4b763ac7d1c99e57e3f8ac69a94bd190427205b36905efba6f8a9513c5b034c5ccb9f334"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UtilsModule-4c92583d1c891addab293a48e8fed9fbb55269317ebd2fa485a2d76c4b763ac7d1c99e57e3f8ac69a94bd190427205b36905efba6f8a9513c5b034c5ccb9f334"' :
                                            'id="xs-components-links-module-UtilsModule-4c92583d1c891addab293a48e8fed9fbb55269317ebd2fa485a2d76c4b763ac7d1c99e57e3f8ac69a94bd190427205b36905efba6f8a9513c5b034c5ccb9f334"' }>
                                            <li class="link">
                                                <a href="components/EnteteComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EnteteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PiedComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PiedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PopupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PopupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-UtilsModule-4c92583d1c891addab293a48e8fed9fbb55269317ebd2fa485a2d76c4b763ac7d1c99e57e3f8ac69a94bd190427205b36905efba6f8a9513c5b034c5ccb9f334"' : 'data-target="#xs-pipes-links-module-UtilsModule-4c92583d1c891addab293a48e8fed9fbb55269317ebd2fa485a2d76c4b763ac7d1c99e57e3f8ac69a94bd190427205b36905efba6f8a9513c5b034c5ccb9f334"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-UtilsModule-4c92583d1c891addab293a48e8fed9fbb55269317ebd2fa485a2d76c4b763ac7d1c99e57e3f8ac69a94bd190427205b36905efba6f8a9513c5b034c5ccb9f334"' :
                                            'id="xs-pipes-links-module-UtilsModule-4c92583d1c891addab293a48e8fed9fbb55269317ebd2fa485a2d76c4b763ac7d1c99e57e3f8ac69a94bd190427205b36905efba6f8a9513c5b034c5ccb9f334"' }>
                                            <li class="link">
                                                <a href="pipes/EcartsPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EcartsPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FiltresPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FiltresPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/MarkPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MarkPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ProfilsPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilsPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TypesPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TypesPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/InfosComponent.html" data-type="entity-link" >InfosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InfosComponent-1.html" data-type="entity-link" >InfosComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CustomErrorMatch.html" data-type="entity-link" >CustomErrorMatch</a>
                            </li>
                            <li class="link">
                                <a href="classes/Dataset.html" data-type="entity-link" >Dataset</a>
                            </li>
                            <li class="link">
                                <a href="classes/Profil.html" data-type="entity-link" >Profil</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rendement.html" data-type="entity-link" >Rendement</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/BucketService.html" data-type="entity-link" >BucketService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChartsService.html" data-type="entity-link" >ChartsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataService.html" data-type="entity-link" >DataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MsgService.html" data-type="entity-link" >MsgService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PredictionsService.html" data-type="entity-link" >PredictionsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StoreService.html" data-type="entity-link" >StoreService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CreeI.html" data-type="entity-link" >CreeI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataI.html" data-type="entity-link" >DataI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatasetI.html" data-type="entity-link" >DatasetI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Droits.html" data-type="entity-link" >Droits</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileI.html" data-type="entity-link" >FileI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FiltresI.html" data-type="entity-link" >FiltresI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphI.html" data-type="entity-link" >GraphI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphSetI.html" data-type="entity-link" >GraphSetI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MoyennesI.html" data-type="entity-link" >MoyennesI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MsgI.html" data-type="entity-link" >MsgI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageI.html" data-type="entity-link" >PageI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProfilI.html" data-type="entity-link" >ProfilI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RendementI.html" data-type="entity-link" >RendementI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TraductionI.html" data-type="entity-link" >TraductionI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserI.html" data-type="entity-link" >UserI</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});