import { Component, ElementRef, input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { DropdownService } from '@shared/services/dropdown.service'

@Component({
  selector: 'app-icon-dropdown',
  imports: [MatIconModule],
  templateUrl: './icon-dropdown.component.html',
  styleUrl: './icon-dropdown.component.scss',
})
export class IconDropdownComponent {
  @ViewChild('dropdownTrigger', { read: ElementRef })
  dropdownTrigger!: ElementRef<HTMLElement>

  @ViewChild('dropdownTemplate')
  dropdownTemplate!: TemplateRef<any>

  iconName = input<string>('')

  constructor(private dropdownService: DropdownService, private viewContainerRef: ViewContainerRef) {}

  openDropdown() {
    this.dropdownService.openTemplateDropdown(this.dropdownTemplate, {
      origin: this.dropdownTrigger.nativeElement,
      hasBackdrop: true,
      panelClass: 'custom-dropdown',
      viewContainerRef: this.viewContainerRef,
    })
  }
}
