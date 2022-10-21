import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { LimitToPipe } from "./pipes/limit-to.pipe";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { ContentPlaceholderAnimationComponent } from "./components/content-placeholder-animation/content-placeholder-animation.component";
import { LocalDatePipe } from "./pipes/local-date.pipe";
import { YesNoPipe } from "./pipes/yes-no.pipe";
import { LayoutComponent } from "./layout/layout.component";
import { DataPropertyGetterPipe } from "./pipes/data-property-getter.pipe";
import { TableReusableComponent } from "./components/table-reusable/table-reusable.component";
import { AlertComponent } from "./components/alert/alert.component";
import { HideForRolesDirective } from "./directives/hide-for-roles.directive";
import { CommonModule } from "@angular/common";
import { ShowForRolesDirective } from './directives/show-for-roles.directive';
import { AddressFormComponent } from "./components/address-form/address-form.component";
import { TelephoneFormComponent } from './components/telephone-form/telephone-form.component';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { ScrollManagerDirective } from './directives/scroll-manager.directive';
import { ScrollSectionDirective } from './directives/scroll-section.directive';
import { ScrollAnchorDirective } from './directives/scroll-anchor.directive';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RxReactiveFormsModule,
        FlexLayoutModule,
    ],
    declarations: [
        ConfirmDialogComponent,
        ContentPlaceholderAnimationComponent,
        LimitToPipe,
        LocalDatePipe,
        YesNoPipe,
        LayoutComponent,
        DataPropertyGetterPipe,
        TableReusableComponent,
        AlertComponent,
        HideForRolesDirective,
        ShowForRolesDirective,
        AddressFormComponent,
        TelephoneFormComponent,
        ScrollManagerDirective,
        ScrollSectionDirective,
        ScrollAnchorDirective
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        RxReactiveFormsModule,
        FlexLayoutModule,
        CustomMaterialModule,
        LimitToPipe,
        ConfirmDialogComponent,
        ContentPlaceholderAnimationComponent,
        LocalDatePipe,
        YesNoPipe,
        TableReusableComponent,
        HideForRolesDirective,
        ShowForRolesDirective,
        ScrollManagerDirective,
        ScrollSectionDirective,
        ScrollAnchorDirective,
        AddressFormComponent,
        TelephoneFormComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
