import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpCacheManager, withCache } from "@ngneat/cashew";
import { Observable } from "rxjs";
import { BASE_ENDPOINT } from "src/app/config/app";
import { Address } from "src/app/shared/models/address";
import { MobileNumber } from "src/app/shared/models/mobileNumber";
import { Roles } from "src/app/shared/models/roles";
import { SignupUser } from "src/app/shared/models/signupUser";
import { User } from "src/app/shared/models/user";
import { CommonServiceService } from "src/app/shared/services/common-service.service";

@Injectable({
  providedIn: "root",
})
export class UserService extends CommonServiceService<SignupUser, User> {
  override baseUrl = `${BASE_ENDPOINT}/users`;

  constructor(http: HttpClient, manager: HttpCacheManager) {
    super(http, manager);
  }

  assingnUserRole(email: string, roleDto: Roles): Observable<Roles[]> {
    const roleToAssign: Roles = {
      ...roleDto,
      name: "ROLE_" + roleDto?.name.trim().toUpperCase(),
    };
    return this.http.post<Roles[]>(
      `${this.baseUrl}/rol/${email}`,
      roleToAssign,
      {
        context: withCache({
          bucket: this.bucket,
        }),
      }
    );
  }

  getUserInformation(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`, {
      context: withCache({
        bucket: this.bucket,
      }),
    });
  }

  saveUserAddresses(addresses: Address[]): Observable<Address[]> {
    return this.http.post<Address[]>(`${this.baseUrl}/address`, addresses, {
      context: withCache({
        bucket: this.bucket,
      }),
    });
  }

  saveUserMobileNumbers(mobileNumbers: MobileNumber[]): Observable<MobileNumber[]> {
    return this.http.post<MobileNumber[]>(`${this.baseUrl}/mobile-numbers`, mobileNumbers, {
      context: withCache({
        bucket: this.bucket,
      }),
    });
  }
}
