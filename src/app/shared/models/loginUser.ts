import { FormControl } from "@angular/forms";

export class LoginUser {
  email: string;
  password: string;
  deviceInfo: DeviceInfo;
  constructor(email: string, password: string, deviceInfo: DeviceInfo) {
    this.email = email;
    this.password = password;
    this.deviceInfo = deviceInfo;
  }
}

export interface LoginUser {
  email: string;
  password: string;
  deviceInfo: DeviceInfo;
}

export type LoginUserForm = {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: boolean;
}

interface DeviceInfo {
  deviceId: string;
  deviceType: string;
}