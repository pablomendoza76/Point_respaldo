import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-iconos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './iconos.component.html',
  styleUrls: ['./iconos.component.scss']
})
export class IconosComponent {
  @Input() tipo: 'admin' = 'admin';
  @Input() colapsado: boolean = false;
}
