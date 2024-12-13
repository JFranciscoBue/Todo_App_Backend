export class CreateUserDto {
  fullname: string;
  email: string;
  password: string;
}

export class ChangePasswordDto {
  password: string;
}