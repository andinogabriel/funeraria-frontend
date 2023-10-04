import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { first } from "rxjs";
import { UserService } from "src/app/features/services/user.service";
import { Address } from "src/app/shared/models/address";
import { City } from "src/app/shared/models/city";
import { ConfirmDialog } from "src/app/shared/models/confirmDialog";
import { MobileNumber } from "src/app/shared/models/mobileNumber";
import { Province } from "src/app/shared/models/province";
import { User } from "src/app/shared/models/user";
import { AddressFormService } from "src/app/shared/services/address-form.service";
import { ConfirmDialogService } from "src/app/shared/services/confirm-dialog.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { TelephoneFormService } from "src/app/shared/services/telephone-form.service";

@Component({
  selector: "app-account-page",
  templateUrl: "./account-page.component.html",
  styleUrls: ["./account-page.component.css"],
})
export class AccountPageComponent implements OnInit {
  accountForm!: FormGroup;
  selectedProvince: Province = null;
  provinces: Province[] = [];
  cities: City[] = [];
  user: User;
  addressessLoaded: Promise<boolean>;

  constructor(
    private titleService: Title,
    private snackbarService: SnackbarService,
    private dialogService: ConfirmDialogService,
    private fb: FormBuilder,
    private addressFormService: AddressFormService,
    private telephoneFormService: TelephoneFormService,
    private userService: UserService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.titleService.setTitle("funeraria-frontend - Account");
      this.getLoggedUserInformation();
      this.createForm();
      this.getAddresses();
      this.getMobileNumbers();
    });
  }

  saveUserAddresses(): void {
    this.userService.saveUserAddresses(this.addresses.value as Address[]).
    pipe(first())
    .subscribe({
      next: () => this.snackbarService.success('Direcciones guardadas satisfactoriamente.'),
      error: () => {
        this.dialogService.open(this.addAddressesErrMsg)
      }
    });
  }

  saveUserMobileNumbers(): void {
    console.log(this.mobileNumbers);
    this.userService.saveUserMobileNumbers(this.mobileNumbers.value as MobileNumber[]).
    pipe(first())
    .subscribe({
      next: () => this.snackbarService.success('Números de telefono guardados satisfactoriamente.'),
      error: () => {
        this.dialogService.open(this.addAMobileNumbersErrMsg)
      }
    });
  }


  get addresses() {
    return <FormArray>this.accountForm.get("addresses");
  }

  addAddress() {
    this.addresses.push(this.addressFormService.getAddressForm());
  }

  get mobileNumbers() {
    return (<FormArray>this.accountForm.get('mobileNumbers'));
  }

  addMobileNumber() {
    this.mobileNumbers.push(this.telephoneFormService.getTelephoneForm());
  }

  deleteAddress(addressIndex: number) {
    const hasId = !!this.addresses.value[addressIndex]["id"];
    const confirmDeletion = () => {
      this.dialogService.open({
        confirmText: "Aceptar",
        message: "¿Estás seguro de eliminar esta dirección?",
        title: "Eliminar dirección",
      });
      this.dialogService.confirmed().subscribe((confirmed) => {
        confirmed && this.addresses.removeAt(addressIndex);
      });
    };
    hasId ? confirmDeletion() : this.addresses.removeAt(addressIndex);
  }

  deleteMobileNumber(mobileNumerIndex: number) {
    const hasId = !!this.mobileNumbers.value[mobileNumerIndex]['id'];
    const confirmDeletion = () => {
      this.dialogService.open({
        confirmText: 'Aceptar',
        message: `¿Estas seguro de eliminar el número de télefono: ${this.mobileNumbers?.value[mobileNumerIndex]['mobileNumber']}?`,
        title: 'Eliminar número de télefono'
      });
      this.dialogService.confirmed().subscribe((confirmed) => { 
        confirmed && this.mobileNumbers.removeAt(mobileNumerIndex);
      });
    };
    hasId ? confirmDeletion() : this.mobileNumbers.removeAt(mobileNumerIndex);
  }

  private getLoggedUserInformation(): void {
    this.userService.getUserInformation()
    .pipe(first())
    .subscribe({
      next: (user) => this.user = user,
      error: (err) => this.snackbarService.error(err?.error?.message ? err?.error?.message : 'Hubo un error al buscar ala informacion del usuario logueado actualmente.')
    });
  }

  private createForm() {
    this.accountForm = new FormGroup({
      mobileNumbers:  new FormArray([this.telephoneFormService.getTelephoneForm()]),
      addresses: new FormArray([this.addressFormService.getAddressForm()])
    });
  }

  private getAddresses(): void {
    if(this.user?.hasOwnProperty('addresses')) {
      this.addresses.clear();
      Object.values(this.user?.addresses as Address[]).forEach(a => {
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
    this.addressessLoaded = Promise.resolve(true)
  }

  private getMobileNumbers(): void {
    if(this.user?.hasOwnProperty('mobileNumbers')) {
      this.mobileNumbers.clear();
      Object.values(this.user?.mobileNumbers as MobileNumber[]).forEach(m => {
        const mobileNumber = this.fb.group({
          id: m?.id,
          mobileNumber: [m?.mobileNumber ?? null, RxwebValidators.unique()]
        });
        this.mobileNumbers.push(mobileNumber);
      });
    }
  }

  private readonly addAddressesErrMsg: ConfirmDialog = {
    confirmText: 'Aceptar', 
    message: 'Error al registrar estas direcciones, por favor intente nuevamente.', 
    title: 'Error al registar direcciones'
  }

  private readonly addAMobileNumbersErrMsg: ConfirmDialog = {
    confirmText: 'Aceptar', 
    message: 'Error al registrar estos números de telefono, por favor intente nuevamente.', 
    title: 'Error al registar números de telefono'
  }
}
