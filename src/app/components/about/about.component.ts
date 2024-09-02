import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  constructor(private location: Location) {}

  voltar() {
    this.location.back();
  }
}
