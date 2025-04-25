import { Injectable } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { Icon } from '@shared/enums/icon.interface'

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {}

  registerIcons(icons: Icon[]) {
    icons.forEach((icon) => {
      const iconPath = `public/icons/${icon.fill}/${!!icon.path ? icon.path : icon.name}.svg`
      this.matIconRegistry.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(iconPath))
    })
  }
}
