import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  email: string = '';
  categories = [
    'Graphics',
    'PSDs',
    'Icons',
    'Templates',
    'Themes',
    'Addons',
    'Fonts',
    'Texture',
    'Patterns',
    'Background',
    'Buttons',
    'Forms',
    'Navigation',
    'GUI',
    'UI Kits',
    'Infographics',
    'Graphs',
    'Logos',
    'Vector',
    'Business Card',
  ];
  constructor() {}

  ngOnInit(): void {}
}
