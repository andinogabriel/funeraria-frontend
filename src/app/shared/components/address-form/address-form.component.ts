import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, UntypedFormBuilder } from "@angular/forms";
import { City } from "../../models/city";
import { Province } from "../../models/province";
import { CityService } from "../../services/city.service";
import { ProvinceService } from "../../services/province.service";

@Component({
  selector: "app-address-form",
  templateUrl: "./address-form.component.html",
  styleUrls: ["./address-form.component.css"],
})
export class AddressFormComponent implements OnInit {
  selectedProvince: Province = null;
  provinces: Province[] = [];
  cities: City[] = [];
  addressForm!: FormGroup;
  @Input() inputFormGroup = this.fb.group({});
  @Input() formGroupName!: string;

  addressInputs = [
    {
      name: "streetName",
      label: "Calle",
      type: "text",
      smWidth: "0 1 calc(33% - 15px)",
      lgWidth: "100%",
      errors: [{ name: "required", message: "La calle requerida" }],
    },
    {
      name: "blockStreet",
      label: "Altura",
      type: "number",
      smWidth: "0 1 calc(20% - 15px)",
      lgWidth: "100%",
      errors: [],
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
  ]

  constructor(
    private fb: UntypedFormBuilder,
    private provinceService: ProvinceService,
    private cityService: CityService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.getProvinces();
      if(this.inputFormGroup.get('city').value) {
        this.selectedProvince = this.inputFormGroup.get('province').value;
        this.getCities();
      }
    });
  }

  compareProvionceFn(elem1: Province, elem2: Province): boolean {
    if (elem1 === undefined && elem2 === undefined) return true;
    return elem1 === null ||
      elem2 === null ||
      elem1 === undefined ||
      elem2 === undefined
      ? false
      : elem1["id"] === elem2["id"];
  }

  compareCityFn(elem1: City, elem2: City): boolean {
    if (elem1 === undefined && elem2 === undefined) return true;
    return elem1 === null ||
      elem2 === null ||
      elem1 === undefined ||
      elem2 === undefined
      ? false
      : elem1["id"] === elem2["id"];
  }

  hasError = (controlName: string, errorName: string): boolean => {
    return !!!this.formGroupName ? this.inputFormGroup?.controls[controlName].hasError(errorName) : this.addressForm?.controls[controlName].hasError(errorName);
  };

  getCities(): void {
    const provinceId = this.selectedProvince.id;
    this.getCitiesByProvince(provinceId);
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
