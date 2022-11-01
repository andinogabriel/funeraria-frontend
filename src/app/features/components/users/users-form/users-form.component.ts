import { AfterViewInit, Component, OnInit } from "@angular/core";
import { RoleService } from "src/app/shared/services/role.service";
import { ConfirmDialogService } from "src/app/shared/services/confirm-dialog.service";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { Roles } from "./../../../../shared/models/roles";
import { MultiSelect } from "src/app/shared/models/multiSelect";
import { first } from "rxjs";

@Component({
  selector: "app-users-form",
  templateUrl: "./users-form.component.html",
  styleUrls: ["./users-form.component.css"],
})
export class UsersFormComponent implements OnInit, AfterViewInit {
  dropdownList: MultiSelect[] = [];
  selectedItems: MultiSelect[] = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private roleService: RoleService,
    private dialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.findAllRoles();
      this.getSelectedItems();
      this.initDropdownSettings();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.findAllRoles();
      this.getSelectedItems();
      this.initDropdownSettings();
    });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  private findAllRoles() {
    this.roleService
      .findAll()
      .pipe(first())
      .subscribe({
        next: (roles) => (this.dropdownList = this.transformData(roles)),
        error: () => this.dialogService.open(this.getRolesErrMsg),
      });
  }

  private getSelectedItems() {
    this.selectedItems = this.dropdownList.filter(
      (role) => role.item_text === "User"
    );
  }

  private initDropdownSettings() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Seleccionar todo",
      unSelectAllText: "Deseleccionar todo",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
  }

  private transformData(roles: Roles[]): MultiSelect[] {
    return roles.map((role) => ({ item_id: role.id, item_text: role.name }));
  }

  private readonly getRolesErrMsg = {
    confirmText: "Aceptar",
    message: "Error al obtener los roles",
    title: "Error al obtener los roels",
  };
}
