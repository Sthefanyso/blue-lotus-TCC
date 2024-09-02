import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  constructor(private location: Location) {}

  voltar() {
    this.location.back();
  }
}
