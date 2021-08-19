import { Component, HostListener, OnInit } from '@angular/core';
import { GiphyServiceService } from './services/giphy-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'accelya-project';
  placeHolderText: string = 'What are you looking for?';
  searchVal: string = '';
  categoriesList: any = ['Show All'];
  optionSelected: string = 'Show All';
  constructor(public giphyService: GiphyServiceService) {}
  ngOnInit(): void {
    this.giphyService.getGifByCatergory().subscribe((response) => {
      response.data.map((items: any) => {
        this.categoriesList.push(items.name);
      });
    });
    if (this.optionSelected === 'Show All') {
      this.giphyService.search('trending');
    }
  }
  @HostListener('window:scroll')
  onScroll() {
    if (
      window.innerHeight + Math.ceil(window.scrollY) >=
      document.body.scrollHeight
    ) {
      this.giphyService.next();
    }
  }

  search() {
    if (this.searchVal === '') {
      alert('Please Enter a valid search val');
      return;
    }
    this.giphyService.search(this.searchVal);
    this.searchVal = '';
  }
  onOptionsSelected(event: any) {
    this.giphyService.search(event);
    if (this.searchVal !== '') {
      this.searchVal = '';
    }
  }
  redirect(val: string) {
    if (val === 'facebook') {
      window.open('https://facebook.com');
    } else if (val === 'google') {
      window.open('https://gmail.com');
    } else if (val === 'twitter') {
      window.open('https://twitter.com');
    } else {
      window.open('https://rss.com');
    }
  }
}
