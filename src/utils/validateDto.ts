import { CreateUserDto } from 'src/dtos/User.dto';

export const validUserDto = (userDto: CreateUserDto) => {
  const { email, fullname, password } = userDto;

  if (!email || !fullname || !password) {
    return false;
  } else {
    return true;
  }
};
