import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { TokenService } from 'src/app/core/services/token.service';
import { UserService } from 'src/app/features/services/user.service';
import { LoginUser } from 'src/app/shared/models/loginUser';
import { SignupUser } from 'src/app/shared/models/signupUser';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { mustMatch } from 'src/app/shared/utils/validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: UntypedFormGroup;
  loading!: boolean;
  isLogged = false;
  signupUser: SignupUser;
  signupErrMessage: string;
  successSignupMsg = 'Se ha registrado satisfactoriamente.';
  unsuccessSignupMsg = 'No se ha podido registrar, intentelo nuevamente.';
  unsuccessLoginMsg = 'No se ha podido iniciar sesión, intentelo nuevamente.';

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
    private userService: UserService
  ) {}


  ngOnInit(): void {
    this.titleService.setTitle("Registrate");
    this.createForm();
  }

  private createForm() {
    this.signupForm = new UntypedFormGroup({
      firstName: new UntypedFormControl("", [Validators.required]),
      lastName: new UntypedFormControl("", [Validators.required]),
      email: new UntypedFormControl("", [Validators.required,Validators.email]),
      password: new UntypedFormControl("", [Validators.required, Validators.minLength(8)]),
      matchingPassword: new UntypedFormControl("", [Validators.required, Validators.minLength(8)]),
    }, mustMatch('password', 'matchingPassword'));
    
  }

  signup(userToCreate: SignupUser) {
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
    this.authenticationService.login(new LoginUser(email, password)).subscribe({
      next: (userLogged) => this.tokenService.setToken(userLogged?.authorization),
      error: (error) => {
        console.log(error);
        this.snackbarService.error(this.unsuccessLoginMsg);
      },
      complete: () => this.loading = false
    });
  }

}
