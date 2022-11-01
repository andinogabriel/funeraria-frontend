import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ReusableTableColumn } from "./../../models/reusableTableColumn";

@Component({
  selector: "app-table-reusable",
  templateUrl: "./table-reusable.component.html",
  styleUrls: ["./table-reusable.component.css"],
})
export class TableReusableComponent implements OnInit, AfterViewInit {
  public tableDataSource = new MatTableDataSource<any[]>([]);
  public displayedColumns!: string[];
  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) matSort!: MatSort;

  @Input() isPageable = true;
  @Input() isSortable = true;
  @Input() isFilterable = true;
  @Input() hasMoreInfo = false;
  @Input() noCreateAndDelete = false;
  @Input() emptyIcon!: string;
  @Input() emptyMessage!: string;
  @Input() tableColumns!: ReusableTableColumn[];
  @Input() rowActionIcon!: string;
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];

  selectedRow: any;

  @Output() deleteAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() createAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() updateAction: EventEmitter<any> = new EventEmitter<any>();
  @Output() showMoreAction: EventEmitter<any> = new EventEmitter<any>();

  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const columnNames = this.tableColumns.map(
      (tableColumn: ReusableTableColumn) => tableColumn.name
    );
    this.displayedColumns = this.rowActionIcon ? [this.rowActionIcon, ...columnNames]
      : columnNames;
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;
  }

  private setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.cdr.detectChanges();
    this.tableDataSource.paginator = this.matPaginator;
    this.tableDataSource.sort = this.matSort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  sortTable(sortParameters: Sort) {
    sortParameters.active = this?.tableColumns?.find(
      (column) => column?.name === sortParameters?.active
    )?.dataKey;
    const keyName = sortParameters.active;
    if (sortParameters.direction === 'asc') {
      this.tableDataSource.data = this.tableDataSource.data
        .sort((a,b) => a[keyName] < b[keyName] ? -1 : (a[keyName] > b[keyName] ? 1 : 0));
    } else if (sortParameters.direction === 'desc') {
      this.tableDataSource.data = this.tableDataSource.data
        .sort((a,b) => a[keyName] > b[keyName] ? -1 : (a[keyName] < b[keyName] ? 1 : 0));
    } else {
      this.tableDataSource;
    }
  }

  emitDeleteAction() {
    this.deleteAction.emit(this.selectedRow);
    this.selectedRow = null;
  }

  emitCreateAction() {
    this.createAction.emit();
  }

  emitUpdateAction() {
    this.updateAction.emit(this.selectedRow);
    this.selectedRow = null;
  }

  emitShowMoreAction() {
    this.showMoreAction.emit(this.selectedRow);
    this.selectedRow = null;
  }
  
}
