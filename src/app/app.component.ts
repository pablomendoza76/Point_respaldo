import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { outlined } from '@shared/enums/icon.enum'
import { IconService } from '@shared/services/icon.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class AppComponent {
  constructor(private iconService: IconService) {}

  ngOnInit() {
    const icons = [...outlined]
    this.iconService.registerIcons(icons)
  }
}
