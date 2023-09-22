import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Affiliate } from 'src/app/features/models/affiliate';
import { ReusableTableColumn } from 'src/app/shared/models/reusableTableColumn';

@Component({
  selector: 'app-affiliates-search-table',
  templateUrl: './affiliates-search-table.component.html',
  styleUrls: ['./affiliates-search-table.component.css']
})
export class AffiliatesSearchTableComponent implements OnInit {

  tableDataSource = new MatTableDataSource<Affiliate[]>([]);
  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) matSort!: MatSort;
  selectedRow: Affiliate;
  tableColumns!: ReusableTableColumn[];
  displayedColumns = ['lastName', 'firstName','dni', 'affiliator', 'relationship'];
  
  @Output() selectAffiliate: EventEmitter<Affiliate> = new EventEmitter<Affiliate>();

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;
  }

  @Input() set tableData(data: Affiliate[]) {
    this.setTableDataSource(data);
  }


  emitAffiliateSelectedAction(row: Affiliate) {
    this.selectedRow = row;
    this.selectAffiliate.emit(this.selectedRow);
  }

 

  sortTable(sortParameters: Sort) {
    const keyName = this.tableColumns.find(column => column.name === sortParameters.active)?.dataKey;
    if (keyName) {
      this.tableDataSource.data.sort((a, b) => {
        const comparison = a[keyName] < b[keyName] ? -1 : a[keyName] > b[keyName] ? 1 : 0;
        return sortParameters.direction === 'desc' ? -comparison : comparison;
      });
    }
  }

  private setTableDataSource(data: Affiliate[]) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.cdr.detectChanges();
    this.tableDataSource.paginator = this.matPaginator;
    this.tableDataSource.sort = this.matSort;
  }


}
