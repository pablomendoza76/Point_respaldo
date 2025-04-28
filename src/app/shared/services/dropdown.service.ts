import { Injectable, Injector, TemplateRef, ViewContainerRef } from '@angular/core'
import { ComponentType, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal'

export interface DropdownConfig {
  origin: HTMLElement
  width?: string | number
  height?: string | number
  hasBackdrop?: boolean
  backdropClass?: string
  panelClass?: string | string[]
  data?: any
  viewContainerRef?: ViewContainerRef
}

@Injectable({
  providedIn: 'root',
})
export class DropdownService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  // Open a component as dropdown
  openComponentDropdown<T>(component: ComponentType<T>, config: DropdownConfig): { overlayRef: OverlayRef; componentInstance: T } {
    const overlayRef = this.createOverlay(config)

    const componentPortal = new ComponentPortal(component, null, this.createInjector(config.data))

    const componentRef = overlayRef.attach(componentPortal)

    // Add backdrop click listener
    if (config.hasBackdrop !== false) {
      overlayRef.backdropClick().subscribe(() => overlayRef.dispose())
    }

    return {
      overlayRef,
      componentInstance: componentRef.instance,
    }
  }

  // Open a template as dropdown
  openTemplateDropdown(template: TemplateRef<any>, config: DropdownConfig): OverlayRef {
    const overlayRef = this.createOverlay(config)

    if (!config.viewContainerRef) {
      throw new Error('ViewContainerRef is required for template portals')
    }

    const templatePortal = new TemplatePortal(template, config.viewContainerRef, {
      $implicit: config.data,
      close: () => overlayRef.dispose(),
    })

    overlayRef.attach(templatePortal)

    // Add backdrop click listener
    if (config.hasBackdrop !== false) {
      overlayRef.backdropClick().subscribe(() => overlayRef.dispose())
    }

    return overlayRef
  }

  private createOverlay(config: DropdownConfig): OverlayRef {
    // Create position strategy
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(config.origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: 4,
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ])
      .withViewportMargin(8)
      .withPush(true)

    const overlayConfig = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: config.hasBackdrop !== false,
      backdropClass: config.backdropClass || 'cdk-overlay-transparent-backdrop',
      panelClass: config.panelClass,
      width: config.width,
      height: config.height,
    })

    return this.overlay.create(overlayConfig)
  }

  private createInjector(data: any): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [{ provide: 'DROPDOWN_DATA', useValue: data }],
    })
  }
}
