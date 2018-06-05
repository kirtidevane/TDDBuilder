import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpserviceService {

  constructor(private http: HttpClient) { }

  getReq() {
    // tslint:disable:max-line-length
    return this.http.get('http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/lastBuild/buildNumber', { responseType: 'text' });
  }
}
