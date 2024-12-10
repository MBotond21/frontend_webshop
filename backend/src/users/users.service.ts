import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  db: PrismaService;

  constructor(db: PrismaService){
    this.db = db;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPw = await argon2.hash(createUserDto.password);
    const newUser = await this.db.user.create({
      data: {
        ...createUserDto,
        password: hashedPw
      }
    });
    delete newUser.password;
    return newUser;
  }

  async login(loginData: LoginDto) {
    const user = await this.db.user.findUniqueOrThrow({
      where: {
        email: loginData.email
      }
    });
    if (await argon2.verify(await user.password, loginData.password)) {
      // Sikeres!
      delete user.password;
      return user;
    } else {
      throw new Error('Invalid password');
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return await this.db.user.delete({
      where: { id }
    });
  }
}
