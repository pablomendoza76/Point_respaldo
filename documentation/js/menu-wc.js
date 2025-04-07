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
                    <a href="index.html" data-type="index-link">app-biling-3 documentation</a>
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
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AdministracionComponent.html" data-type="entity-link" >AdministracionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BarraBusquedaComponent.html" data-type="entity-link" >BarraBusquedaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BarraUbicacionComponent.html" data-type="entity-link" >BarraUbicacionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BillingSofAdminComponent.html" data-type="entity-link" >BillingSofAdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClientesComponent.html" data-type="entity-link" >ClientesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClientesVistaComponent.html" data-type="entity-link" >ClientesVistaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfiguracionComponent.html" data-type="entity-link" >ConfiguracionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CuentasContablesComponent.html" data-type="entity-link" >CuentasContablesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CuentasVistasComponent.html" data-type="entity-link" >CuentasVistasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeleteModalComponent.html" data-type="entity-link" >DeleteModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DynamicMenuComponent.html" data-type="entity-link" >DynamicMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmpresaComponent.html" data-type="entity-link" >EmpresaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormularioDinamicoComponent.html" data-type="entity-link" >FormularioDinamicoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormularioDinamicoLoaderComponent.html" data-type="entity-link" >FormularioDinamicoLoaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImportarComponent.html" data-type="entity-link" >ImportarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MarcasComponent.html" data-type="entity-link" >MarcasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PlanCuentasComponent.html" data-type="entity-link" >PlanCuentasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProveedoresComponent.html" data-type="entity-link" >ProveedoresComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProveedoresVistaComponent.html" data-type="entity-link" >ProveedoresVistaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PruebraComponent.html" data-type="entity-link" >PruebraComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TablaDinamicaComponent.html" data-type="entity-link" >TablaDinamicaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TarifasPorGrupoComponent.html" data-type="entity-link" >TarifasPorGrupoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TiposClientesComponent.html" data-type="entity-link" >TiposClientesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TiposProductosComponent.html" data-type="entity-link" >TiposProductosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TiposProveedoresComponent.html" data-type="entity-link" >TiposProveedoresComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TiposPVPComponent.html" data-type="entity-link" >TiposPVPComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TiposPvpVistaComponent.html" data-type="entity-link" >TiposPvpVistaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VistaGeneralComponent.html" data-type="entity-link" >VistaGeneralComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdministracionServicios.html" data-type="entity-link" >AdministracionServicios</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClientesService.html" data-type="entity-link" >ClientesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CuentasContablesService.html" data-type="entity-link" >CuentasContablesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DashboardService.html" data-type="entity-link" >DashboardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FilterEffects.html" data-type="entity-link" >FilterEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MarcasService.html" data-type="entity-link" >MarcasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MenuRoutesService.html" data-type="entity-link" >MenuRoutesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlanCuentasService.html" data-type="entity-link" >PlanCuentasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProveedoresService.html" data-type="entity-link" >ProveedoresService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PVPService.html" data-type="entity-link" >PVPService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubproductoService.html" data-type="entity-link" >SubproductoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TablaEffects.html" data-type="entity-link" >TablaEffects</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TarifasService.html" data-type="entity-link" >TarifasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TipoClientesService.html" data-type="entity-link" >TipoClientesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TipoProductoService.html" data-type="entity-link" >TipoProductoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TipoProveedoresService.html" data-type="entity-link" >TipoProveedoresService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AppState.html" data-type="entity-link" >AppState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BusinessStat.html" data-type="entity-link" >BusinessStat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BusinessStat-1.html" data-type="entity-link" >BusinessStat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColumnaVisible.html" data-type="entity-link" >ColumnaVisible</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterState.html" data-type="entity-link" >FilterState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FiltroConfiguracion.html" data-type="entity-link" >FiltroConfiguracion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuItem.html" data-type="entity-link" >MenuItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Module.html" data-type="entity-link" >Module</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Module-1.html" data-type="entity-link" >Module</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModuleGroup.html" data-type="entity-link" >ModuleGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModuleGroup-1.html" data-type="entity-link" >ModuleGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification-1.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationGroup.html" data-type="entity-link" >NotificationGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationGroup-1.html" data-type="entity-link" >NotificationGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Producto.html" data-type="entity-link" >Producto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TablaState.html" data-type="entity-link" >TablaState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WelcomeData.html" data-type="entity-link" >WelcomeData</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});