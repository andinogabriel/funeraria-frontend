import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SupplierService } from 'src/app/features/services/supplier.service';
import { Address } from 'src/app/shared/models/address';
import { City } from 'src/app/shared/models/city';
import { MobileNumber } from 'src/app/shared/models/mobileNumber';
import { Province } from 'src/app/shared/models/province';
import { Supplier } from 'src/app/shared/models/supplier';
import { AddressFormService } from 'src/app/shared/services/address-form.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TelephoneFormService } from 'src/app/shared/services/telephone-form.service';
import { CommonFormComponent } from '../../common-form.component';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent extends CommonFormComponent<
Supplier,
Supplier,
SupplierService
> {

  supplierFormInputs = [
    {
      name: 'name', label: 'Nombre', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El nombre es requerido.'},
      ]
    },
    {
      name: 'nif', label: 'NIF', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El NIF es requerido.'},
      ]
    },
    {
      name: 'email', label: 'Email', type: 'email',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El email es requerido.'},
        {name: 'email', message: 'Ingrese un formato valido de email.'},
      ]
    },
    {
      name: 'webPage', label: 'Pagina web', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: []
    },
  ];
 
  panelOpenState = false;
  selectedProvince: Province = null;
  provinces: Province[] = [];
  cities: City[] = [];

  constructor(
    service: SupplierService,
    @Inject(MAT_DIALOG_DATA) public override data: Supplier,
    dialogRef: MatDialogRef<SupplierFormComponent>,
    snackbarService: SnackbarService,
    dialogService: ConfirmDialogService,
    fb: FormBuilder,
    private addressFormService: AddressFormService,
    private telephoneFormService: TelephoneFormService
  ) {
    super(
      service,
      data,
      dialogRef,
      snackbarService,
      dialogService,
      fb
    );
    this.createdSuccessMessage = `Proveedor ${data ? 'editado' : 'creado'} satisfactoriamente.`;
    this.entityForm = new FormGroup({
      name: new FormControl(''),
      nif: new FormControl(''),
      webPage: new FormControl(''),
      email: new FormControl(''),
      mobileNumbers: new FormArray([]),
      addresses: new FormArray([])
    });
    if(this.data) {
      this.getMobileNumbers();
      this.getAddresses();
      this.entityId = this.data?.nif;
      this.entityInitUpdateFormControl = {
        'name': this.data?.name ?? null,
        'nif': this.data?.nif ?? null,
        'webPage': this.data?.webPage ?? null,
        'email': this.data?.email ?? null
      };
    } else {
      this.entityInitFormControl = {
        'name': new FormControl('', [Validators.required]),
        'nif': new FormControl('', [Validators.required]),
        'webPage': new FormControl(''),
        'email': new FormControl('', [Validators.required, Validators.email]),
        'mobileNumbers':  new FormArray([this.telephoneFormService.getTelephoneForm()]),
        'addresses': new FormArray([this.addressFormService.getAddressForm()])
      };
    }
    this.createdOrUpdateErrorMessage = {
      confirmText: 'Aceptar',
      message: `Ha sucedido un error al intentar ${data ? 'editar' : 'crear'} el proveedor.`,
      title: `Error al ${data ? 'editar' : 'crear'} el proveedor.`
    }
  }

  override ngOnInit(): void {
    this.data ? this.initUpdateFormControl() : this.initFormControl();
  }

  get mobileNumbers() {
    return (<FormArray>this.entityForm.get('mobileNumbers'));
  }

  addMobileNumber() {
    this.mobileNumbers.push(this.telephoneFormService.getTelephoneForm());
  }

  deleteMobileNumber(mobileNumerIndex: number) {
    if(this.mobileNumbers.value[mobileNumerIndex]['id']) {
      this.dialogService.open({
        confirmText: 'Aceptar',
        message: `¿Estas seguro de eliminar el número de télefono: ${this.mobileNumbers?.value[mobileNumerIndex]['mobileNumber']}?`,
        title: 'Eliminar número de télefono'
      });
      this.dialogService.confirmed().subscribe((confirmed) => { 
        confirmed && this.mobileNumbers.removeAt(mobileNumerIndex);
      });
    } else {
      this.mobileNumbers.removeAt(mobileNumerIndex);
    }
  }

  get addresses() {
    return (<FormArray>this.entityForm.get('addresses'));
  }

  addAddress() {
    this.addresses.push(this.addressFormService.getAddressForm());
  }

  deleteAddress(addressIndex: number) {
    if(this.addresses.value[addressIndex]['id'] !== undefined) {
      this.dialogService.open({
        confirmText: 'Aceptar',
        message: '¿Estas seguro de eliminar esta dirección?',
        title: 'Eliminar dirección'
      });
      this.dialogService.confirmed().subscribe((confirmed) => { 
        confirmed && this.addresses.removeAt(addressIndex);
      });
    } else {
      this.addresses.removeAt(addressIndex);
    }
  }

  private getMobileNumbers(): void {
    if(this.data.hasOwnProperty('mobileNumbers')) {
      Object.values(this.data?.mobileNumbers as MobileNumber[]).forEach(m => {
        const mobileNumber = this.fb.group({
          id: m?.id,
          mobileNumber: m?.mobileNumber ?? null
        });
        this.mobileNumbers.push(mobileNumber);
      });
    }
  }

  private getAddresses(): void {
    if(this.data.hasOwnProperty('addresses')) {
      Object.values(this.data?.addresses as Address[]).forEach(a => {
        const address = this.fb.group({
          id: a?.id,
          province: a?.city?.province,
          city: a?.city,
          streetName: a.streetName,
          blockStreet: a?.blockStreet ?? null,
          apartment: a?.apartment ?? null,
          flat: a?.flat ?? null
        });
        this.addresses.push(address);
      });
    }
  }



}
