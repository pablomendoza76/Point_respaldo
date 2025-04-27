import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ICON_NAME } from '@icons/enums/icon.enum'
import { loadIcons } from '@icons/functions/icon.loader'
import { IconService } from 'src/app/icons/services/icon.service'

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
    this.iconService.registerIcons(loadIcons(ICON_NAME))
  }
}
