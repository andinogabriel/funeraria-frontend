import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-telephone-form',
  templateUrl: './telephone-form.component.html',
  styleUrls: ['./telephone-form.component.css']
})
export class TelephoneFormComponent implements OnInit {

  @Input() inputFormGroup = this.fb.group({});

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
  }

  hasError = (controlName: string, errorName: string): boolean => {
    return this.inputFormGroup?.controls[controlName].hasError(errorName);
  };

}
