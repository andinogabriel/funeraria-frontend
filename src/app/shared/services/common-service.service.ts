import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class CommonServiceService<E , M> {
  
  protected baseUrl: string;
  private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  
  constructor(protected http: HttpClient) { }

  public findAll(): Observable<M[]> {
    return this.http.get<M[]>(this.baseUrl);
  };

  public getById(id: number): Observable<M> {
    return this.http.get<M>(`${this.baseUrl}/${id}`);
  };

  public create(entityForm: E): Observable<M> {
    return this.http.post<M>(this.baseUrl, entityForm, {headers: this.headers});
  };

  public edit(id: number, entityForm: E): Observable<M> {
    return this.http.put<M>(`${this.baseUrl}/${id}`, entityForm, {headers: this.headers});
  };

  public deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  };
}
