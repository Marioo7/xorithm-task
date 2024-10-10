import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private dataUrl = 'assets/db.json';

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<any> {
    return this.http.get(this.dataUrl);
  }
}
