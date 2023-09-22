import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective
} from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { first } from "rxjs/operators";
import { City } from "src/app/shared/models/city";
import { DeathCause } from "src/app/shared/models/deathCause";
import { getDeceasedFormControl } from "src/app/shared/models/deceased";
import { Gender } from "src/app/shared/models/gender";
import { Province } from "src/app/shared/models/province";
import { Relationship } from "src/app/shared/models/relationship";
import { SelectInput } from "src/app/shared/models/selectInput";
import { CityService } from "src/app/shared/services/city.service";
import { DeathCauseService } from "src/app/shared/services/death-cause.service";
import { GenderService } from "src/app/shared/services/gender.service";
import { ProvinceService } from "src/app/shared/services/province.service";
import { RelationshipService } from "src/app/shared/services/relationship.service";

@Component({
  selector: "app-deceased-form",
  templateUrl: "./deceased-form.component.html",
  styleUrls: ["./deceased-form.component.css"],
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
  ],
})
export class DeceasedFormComponent implements OnInit {
  genders: Gender[] = [];
  relationships: Relationship[] = [];
  deathCauses: DeathCause[];
  selectedProvince: Province = null;
  provinces: Province[] = [];
  cities: City[] = [];
  maxDate: Date;
  minDate: Date;
  parentForm!: FormGroup;
  stateOptions: string[];
  serializedDate = new FormControl(new Date().toISOString());
  deceasedSelectInputs: SelectInput[] = [];

  deceasedInputs = [
    {
      name: "firstName",
      label: "Nombre",
      type: "text",
      smWidth: "0 1 calc(50% - 15px)",
      lgWidth: "100%",
      errors: [{ name: "required", message: "El Nombre es requerido" }],
    },
    {
      name: "lastName",
      label: "Apellido",
      type: "text",
      smWidth: "0 1 calc(50% - 15px)",
      lgWidth: "100%",
      errors: [{ name: "required", message: "El Apellido es requerido" }],
    },
    {
      name: "dni",
      label: "Dni",
      type: "number",
      smWidth: "0 1 calc(32% - 15px)",
      lgWidth: "100%",
      errors: [
        { name: "required", message: "El dni es requerido" },
        { name: "maxLength", message: "El dni solo puede tener 9 digitos" },
        { name: "minLength", message: "El dni debe tener al menos 6 digitos" },
      ],
    },
  ];

  datesForm = [
    {
      name: "birthDate",
      label: "Fecha de nac.",
      smWidth: "0 1 calc(32% - 15px)",
      lgWidth: "100%",
      dateMin: new Date(new Date().getFullYear() - 130, 0, 1),
      dateMax: new Date(),
      errors: [{ name: "required", message: "La fecha de nac es requerida" }],
    },
    {
      name: "deathDate",
      label: "Fecha de deceso",
      smWidth: "0 1 calc(32% - 15px)",
      lgWidth: "100%",
      dateMax: new Date(),
      dateMin: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() - 10
      ),
      errors: [
        { name: "required", message: "La fecha de deceso es requerida" },
      ],
    },
  ];
  
  addressInputs = [
    {
      name: "streetName",
      label: "Calle",
      type: "text",
      smWidth: "0 1 calc(35% - 15px)",
      lgWidth: "100%",
      errors: [{ name: "required", message: "La calle requerida" }],
    },
    {
      name: "blockStreet",
      label: "Altura",
      type: "number",
      smWidth: "0 1 calc(20% - 15px)",
      lgWidth: "100%",
      errors: [{ name: "required", message: "La altura requerida" }],
    },
    {
      name: "apartment",
      label: "Departamento",
      type: "street",
      smWidth: "0 1 calc(40% - 15px)",
      lgWidth: "100%",
      errors: [],
    },
    {
      name: "flat",
      label: "Piso",
      type: "street",
      smWidth: "0 1 calc(40% - 15px)",
      lgWidth: "100%",
      errors: [],
    },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private parent: FormGroupDirective,
    private genderService: GenderService,
    private relationshipService: RelationshipService,
    private deathcauseService: DeathCauseService,
    private provinceService: ProvinceService,
    private cityService: CityService
  ) {
    //this.deceasedForm = this.formBuilder.group(this.getCreateFormControl());
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getGenders();
      this.getRelationships();
      this.getDeathCauses();
      this.getProvinces();
      this.getProvinceToEdit();
    });
    this.parentForm = this.parent.form;
    this.parentForm.addControl(
      "deceased",
      this.fb.group(getDeceasedFormControl())
    );
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  OnDateChange(event: MatDatepickerInputEvent<Date>, itemName: string) {
    this.parentForm?.get("deceased").get(itemName)?.setValue(event);
  }

  compareFn(elem1: any, elem2: any): boolean {
    if (elem1 === undefined && elem2 === undefined) return true;
    return elem1 === null ||
      elem2 === null ||
      elem1 === undefined ||
      elem2 === undefined
      ? false
      : elem1["id"] === elem2["id"];
  }

  private getGenders(): void {
    this.genderService
      .findAll()
      .pipe(first())
      .subscribe({
        next: (genders: Gender[]) => {
          this.genders = genders;
          this.deceasedSelectInputs = [
            ...this.deceasedSelectInputs,
            {
              name: "gender",
              label: "Genero",
              items: this.genders,
              smWidth: "0 1 calc(33% - 10px)",
              lgWidth: "100%",
              errors: [{ name: "required", message: "El genero es requerido" }],
            },
          ];
        },
        error: (error) => console.log(error?.error),
      });
  }

  private getRelationships(): void {
    this.relationshipService
      .findAll()
      .pipe(first())
      .subscribe({
        next: (relationships: Relationship[]) => {
          this.relationships = relationships;
          this.deceasedSelectInputs = [
            ...this.deceasedSelectInputs,
            {
              name: "deceasedRelationship",
              label: "Parentesco",
              items: this.relationships,
              smWidth: "0 1 calc(33% - 10px)",
              lgWidth: "100%",
              errors: [
                { name: "required", message: "El parentesco es requerido" },
              ],
            },
          ];
        },
        error: (error) => console.log(error?.error),
      });
  }

  private getDeathCauses(): void {
    this.deathcauseService
      .findAll()
      .pipe(first())
      .subscribe({
        next: (deathCauses: DeathCause[]) => {
          this.deathCauses = deathCauses;
          this.deceasedSelectInputs = [
            ...this.deceasedSelectInputs,
            {
              name: "deathCause",
              label: "Causa de muerte",
              items: this.deathCauses,
              smWidth: "0 1 calc(33% - 10px)",
              lgWidth: "100%",
              errors: [
                {
                  name: "required",
                  message: "La causa de muerte es requerida",
                },
              ],
            },
          ];
        },
        error: (error) => console.log(error?.error),
      });
  }

  getCities(): void {
    const provinceId = this.selectedProvince.id;
    this.getCitiesByProvince(provinceId);
  }

  private getProvinceToEdit(): void {
    if(this.parentForm?.get('deceased')?.get('placeOfDeath').value['city']) {
      this.selectedProvince = this.parentForm?.get('deceased')?.get('placeOfDeath')?.get('city')?.value['province'];
      this.getCities();
    }
  }

  private getProvinces(): void {
    this.provinceService.findAll().subscribe({
      next: (provinces) => (this.provinces = provinces),
      error: () => console.log("Error al obtener las provincias."),
    });
  }

  private getCitiesByProvince(provinceId: number): void {
    this.cityService.findAllByProvince(provinceId).subscribe({
      next: (cities) => (this.cities = cities),
      error: () => console.log("Error al obtener las ciudades"),
    });
  }

  
}