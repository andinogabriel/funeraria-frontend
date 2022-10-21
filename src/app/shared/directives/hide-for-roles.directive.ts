import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { TokenService } from "src/app/core/services/token.service";

@Directive({
  selector: "[appHideForRoles]",
})
export class HideForRolesDirective {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private tokenService: TokenService
  ) {}

  @Input() set appHideForRoles(hideForRoles: string[]) {
    const hideFor = hideForRoles || [];
    hideForRoles.length > 0 ? this.roleChecker(hideFor)
      : this.viewContainerRef.createEmbeddedView(this.templateRef);
  }

  roleChecker(hideFor: string[]) {
    const userRoles = this.tokenService.getAuthorities();
    console.log(userRoles);
    if (userRoles.length === 0) {
      this.viewContainerRef.clear();
    } else {
      const idx = userRoles.findIndex((role) => hideFor.indexOf(role) !== -1);
      return idx < 0
        ? this.viewContainerRef.createEmbeddedView(this.templateRef)
        : this.viewContainerRef.clear();
    }
  }
}
