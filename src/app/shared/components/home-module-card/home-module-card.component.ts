import { Component, input } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-home-module-card',
  imports: [MatIconModule, RouterModule],
  templateUrl: './home-module-card.component.html',
  styleUrl: './home-module-card.component.scss',
})
export class HomeModuleCardComponent {
  path = input<string>('')
  iconName = input<string>('')
  moduleName = input<string>('')
}
