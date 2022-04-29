import { Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { TokenService } from "src/app/core/services/token.service";

@Directive({
  selector: "[appShowForRoles]",
})
export class ShowForRolesDirective {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private tokenService: TokenService
  ) {}

  @Input() set appShowForRoles(showForRoles: string[]) {
    const showFor = showForRoles || [];
    if (showForRoles.length > 0) {
      this.roleChecker(showFor);
    } else {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  roleChecker(hideFor: string[]) {
    const userRoles = this.tokenService.getAuthorities();
    if (userRoles.length === 0) {
      this.viewContainerRef.clear();
    } else {
      const idx = userRoles.findIndex((role) => hideFor.indexOf(role) !== -1);
      return idx >= 0
        ? this.viewContainerRef.createEmbeddedView(this.templateRef)
        : this.viewContainerRef.clear();
    }
  }
}
