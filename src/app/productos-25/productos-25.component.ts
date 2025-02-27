import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos-25',
  standalone: true,
  templateUrl: './productos-25.component.html',
  styleUrls: ['./productos-25.component.css'],  // ✅ Corregido: `styleUrls` en plural
  imports: [CommonModule, RouterModule, FormsModule],  // ✅ Solo un `imports`
})
export class Productos25Component {}
