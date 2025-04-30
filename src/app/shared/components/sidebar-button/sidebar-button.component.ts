import { Component, input } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'c-sidebar-button',
  imports: [MatIconModule, RouterModule],
  templateUrl: './sidebar-button.component.html',
  styleUrl: './sidebar-button.component.scss',
})
export class SidebarButtonComponent {
  collapsed = input<boolean>(true)
  path = input<string[]>([])
  iconName = input<string>('')
  moduleName = input<string>('')
}
