import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserInfoComponent } from './user-info/user-info.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [UserListComponent, UserInfoComponent, UsersFormComponent]
})
export class UsersModule { }
