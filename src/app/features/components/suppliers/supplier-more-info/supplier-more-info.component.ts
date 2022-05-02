import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Supplier } from 'src/app/shared/models/supplier';

@Component({
  selector: 'app-supplier-more-info',
  templateUrl: './supplier-more-info.component.html',
  styleUrls: ['./supplier-more-info.component.css']
})
export class SupplierMoreInfoComponent implements OnInit {

  panelOpenState = false;

  constructor(@Inject(MAT_DIALOG_DATA) private data: Supplier,) { }
  supplier: Supplier;

  ngOnInit(): void {
    this.supplier = this.data;
    console.log(this.supplier);
  }

}
