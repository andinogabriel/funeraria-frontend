import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheBucket, HttpCacheManager, requestDataChanged, withCache } from '@ngneat/cashew';
import { Observable } from 'rxjs';

export abstract class CommonServiceService<E , M> {

  protected bucket: CacheBucket;
  protected baseUrl: string;
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  
  constructor(protected http: HttpClient, private manager: HttpCacheManager) { }

  public findAll(): Observable<M[]> {
    return this.http.get<M[]>(this.baseUrl, {
      context: withCache({
        bucket: this.bucket
      }),
    });
  };

  public getById(id: number): Observable<M> {
    return this.http.get<M>(`${this.baseUrl}/${id}`);
  };

  public create(entityForm: E): Observable<M> {
    this.invalidateBucket();
    return this.http.post<M>(this.baseUrl, entityForm, {headers: this.headers});
  };

  public edit(id: any, entityForm: E): Observable<M> {
    this.invalidateBucket();
    return this.http.put<M>(`${this.baseUrl}/${id}`, entityForm, {headers: this.headers});
  };

  public deleteById(id: number): Observable<void> {
    this.invalidateBucket();
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  };

  private invalidateBucket(): void {
    this.manager.delete(this.bucket);
  }
}
