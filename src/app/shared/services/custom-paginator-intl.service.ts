import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginatorIntlService implements MatPaginatorIntl {

  changes = new Subject<void>();

  firstPageLabel = 'Primera página';
  itemsPerPageLabel = 'Elementos por página: ';
  lastPageLabel = 'Última página';
  nextPageLabel = 'Siguiente página';
  previousPageLabel = 'Anterior página';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    const amountPages = Math.ceil(length / pageSize);
    return length === 0 ? 'Página 1 de 1' : `Página ${page + 1} de ${amountPages}`;
  }
}
