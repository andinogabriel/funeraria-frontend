import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  StepperOrientation } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, map } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UserService } from 'src/app/features/services/user.service';
import { getAddressFormControl } from 'src/app/shared/models/address';
import { City } from 'src/app/shared/models/city';
import { DeviceInfo } from 'src/app/shared/models/deviceInfo';
import { LoginUser } from 'src/app/shared/models/loginUser';
import { Province } from 'src/app/shared/models/province';
import { SignupUser } from 'src/app/shared/models/signupUser';
import { AddressFormService } from 'src/app/shared/services/address-form.service';
import { ConfirmDialogService } from 'src/app/shared/services/confirm-dialog.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TelephoneFormService } from 'src/app/shared/services/telephone-form.service';
import { mustMatch } from 'src/app/shared/utils/validators';
import { DeviceUUID } from "device-uuid";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  loading!: boolean;
  isLogged = false;
  signupUser: SignupUser;
  signupErrMessage: string;
  deviceInfo: DeviceInfo = null;
  readonly successSignupMsg = 'Se ha registrado satisfactoriamente.';
  readonly unsuccessSignupMsg = 'No se ha podido registrar, intentelo nuevamente.';
  readonly unsuccessLoginMsg = 'No se ha podido iniciar sesión, intentelo nuevamente.';
  stepperOrientation: Observable<StepperOrientation>;
  selectedProvince: Province = null;
  provinces: Province[] = [];
  cities: City[] = [];
  
  mobileNumberFormGroup = this.fb.group({
    mobileNumber: ['', Validators.required],
  });

  addressFormGroup = this.fb.group(getAddressFormControl);


  formControls = [
    {
      name: 'email', label: 'Email', type: 'email',
      smWidth: '0 1 calc(100% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El email es requerido.'},
        {name: 'email', message: 'Ingrese un formato valido de email.'},
      ]
    },
    {
      name: 'firstName', label: 'Nombre', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El nombre es requerido.'}
      ]
    },
    {
      name: 'lastName', label: 'Apellido', type: 'text',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'El apellido es requerido.'}
      ]
    },
    {
      name: 'password', label: 'Contraseña', type: 'password',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'La contraseña es requerida.'},
        {name: 'minLength', message: 'La contraseña debe tener al menos 8 caracteres.'}
      ]
    },
    {
      name: 'matchingPassword', label: 'Confirmar Contraseña', type: 'password',
      smWidth: '0 1 calc(50% - 15px)', lgWidth: '100%',
      errors: [
        {name: 'required', message: 'Confirmar contraseña es requerida.'},
        {name: 'minLength', message: 'La contraseña debe tener al menos 8 caracteres.'},
        {name: 'mustMatch', message: 'Las contraseñas no coinciden.'}
      ]
    }
  ];

  constructor(
    private router: Router,
    private titleService: Title,
    private snackbarService: SnackbarService,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService,
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private fb: FormBuilder,
    private addressFormService: AddressFormService,
    private telephoneFormService: TelephoneFormService,
    private dialogService: ConfirmDialogService,
    private deviceService: DeviceDetectorService
  ) {
    this.stepperOrientation = breakpointObserver
    .observe('(min-width: 800px)')
    .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }


  ngOnInit(): void {
    this.titleService.setTitle("Registrate");
    this.createForm();
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  private createForm() {
    this.signupForm = new FormGroup({
      firstName:new FormControl<string | null>("", [Validators.required]),
      lastName: new FormControl<string | null>("", [Validators.required]),
      email: new FormControl<string | null>("", [Validators.required, Validators.email]),
      password: new FormControl<string | null>("", [Validators.required, Validators.minLength(8)]),
      matchingPassword: new FormControl<string | null>("", [Validators.required, Validators.minLength(8)]),
      mobileNumbers:  new FormArray([this.telephoneFormService.getTelephoneForm()]),
      addresses: new FormArray([this.addressFormService.getAddressForm()])
    }, mustMatch('password', 'matchingPassword'));
  }

  signup(userToCreate: SignupUser) {
    console.log(userToCreate);
    this.loading = true;
    this.userService.create(userToCreate).subscribe({
      next: () => {
        this.loading = false;
        this.snackbarService.success(this.successSignupMsg);
        //this.loginUser();
        this.router.navigate(['/iniciar-sesion']);
      },
      error: (error) => {
        console.log(error);
        this.snackbarService.error(this.unsuccessSignupMsg)
      },
      complete: () => this.loading = false
    });
  }

  createCompareValidator(controlOne: AbstractControl, controlTwo: AbstractControl) {
    return controlOne.value !== controlTwo.value ? 
      'Las contraseñas no coinciden.' : null;
  }

  private loginUser() {
    const email = this.signupForm.get('email')?.value;
    const password = this.signupForm.get('password')?.value;
    const deviceInfo = {
      deviceId: new DeviceUUID().get(),
      deviceType: `${this.deviceInfo?.os_version}-${this.deviceInfo?.deviceType}-${this.deviceInfo?.browser}-v${this.deviceInfo?.browser_version}`
    }
    this.authenticationService.login(new LoginUser(email, password, deviceInfo)).subscribe({
      next: (userLogged) => this.tokenService.setToken(userLogged?.authorization),
      error: () => {
        this.snackbarService.error(this.unsuccessLoginMsg);
      },
      complete: () => this.loading = false
    });
  }

  get mobileNumbers() {
    return (<FormArray>this.signupForm.get('mobileNumbers'));
  }

  addMobileNumber() {
    this.mobileNumbers.push(this.telephoneFormService.getTelephoneForm());
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

  get addresses() {
    return (<FormArray>this.signupForm.get('addresses'));
  }

  addAddress() {
    this.addresses.push(this.addressFormService.getAddressForm());
  }

  deleteAddress(addressIndex: number) {
    const hasId = !!this.addresses.value[addressIndex]['id'];
    const confirmDeletion = () => {
      this.dialogService.open({
        confirmText: 'Aceptar',
        message: '¿Estás seguro de eliminar esta dirección?',
        title: 'Eliminar dirección'
      });
      this.dialogService.confirmed().subscribe((confirmed) => {
        confirmed && this.addresses.removeAt(addressIndex);
      });
    };
    hasId ? confirmDeletion() : this.addresses.removeAt(addressIndex);
  }

  

}
