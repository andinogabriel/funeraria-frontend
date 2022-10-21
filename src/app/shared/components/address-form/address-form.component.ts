import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
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
  @Input() inputFormGroup = this.fb.group({});

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
    return this.inputFormGroup?.controls[controlName].hasError(errorName);
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
