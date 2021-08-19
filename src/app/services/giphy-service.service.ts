import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { distinct } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class GiphyServiceService {
  static readonly giphyUrlSearch = 'https://api.giphy.com/v1/gifs/search';
  static readonly giphyUrlCategory = 'https://api.giphy.com/v1/gifs/categories';
  static readonly giphyApiKey = 'IUpgS83mkl34ixsQiaGJtzBsulH3JLo3'; // if this doesn't work replace with your key.

  private readonly rating = 'g';
  private readonly lang = 'en';

  currentOffset = 0;
  currentSearchTerm = '';
  pageSize = 20;

  imageResult: GifData[] = [];

  searchResultsSubject = new Subject<Array<GifData>>();
  searchResults$ = new Observable<Array<GifData>>();

  searchRequest = new Subject<SearchReqeust>();
  resetSearch = new Subject<any>();

  constructor(private http: HttpClient) {
    this.searchResults$ = this.searchResultsSubject.asObservable();
    this.searchRequest
      .pipe(distinct((request) => request.offset, this.resetSearch))
      .subscribe(
        (request) => {
          this.getSearchResults(
            request.searchTerm,
            request.offset,
            request.pageSize
          );
        },
        (error) => {
          alert('Gif Not Found, Please Search with some other keyword !!!');
          return throwError(error);
        }
      );
  }

  private getSearchResults(
    searchTerm: string,
    offset: number,
    pageSize: number
  ) {
    const options = {
      params: {
        api_key: GiphyServiceService.giphyApiKey,
        q: searchTerm,
        limit: pageSize.toString(),
        offset: offset.toString(),
        rating: this.rating,
        lang: this.lang,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };
    this.http
      .get<GiphyResult>(GiphyServiceService.giphyUrlSearch, options)
      .subscribe((giphyResult: GiphyResult) => {
        this.imageResult = this.imageResult.concat(giphyResult.data);
        this.currentOffset =
          giphyResult.pagination.offset + giphyResult.pagination.count;

        this.searchResultsSubject.next(this.imageResult);
      });
  }

  search(searchTerm: string) {
    this.currentSearchTerm = searchTerm;
    this.currentOffset = 0;

    this.imageResult = [];
    this.searchResultsSubject.next(this.imageResult);
    this.resetSearch.next(null);

    this.searchRequest.next({
      searchTerm: this.currentSearchTerm,
      offset: this.currentOffset,
      pageSize: this.pageSize,
    });
  }

  next() {
    this.searchRequest.next({
      searchTerm: this.currentSearchTerm,
      offset: this.currentOffset,
      pageSize: this.pageSize,
    });
  }

  setPageSize(size: number) {
    this.pageSize = size;
  }

  getGifByCatergory() {
    const params = {
      api_key: GiphyServiceService.giphyApiKey,
    };
    return this.http.get<any>(GiphyServiceService.giphyUrlCategory, { params });
  }
}

interface GiphyResult {
  data: Array<GifData>;
  pagination: {
    count: number;
    offset: number;
  };
}

interface GifData {
  images: {
    fixed_width: {
      url: string;
    };
    preview_webp: {
      url: string;
    };
  };
  title: string;
}

interface SearchReqeust {
  searchTerm: string;
  offset: number;
  pageSize: number;
}
