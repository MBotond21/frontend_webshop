import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  db: PrismaService;

  constructor(db: PrismaService){
    this.db = db;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.db.user.findUnique({
      where: { email: createUserDto.email }
    });

    const existingUsename = await this.db.user.findUnique({
      where: { userName: createUserDto.userName }
    })

    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    if(existingUsename){
      throw new ConflictException('Username already in use');
    }

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
      const token = randomBytes(32).toString('hex');
      await this.db.token.create({
        data: {
          token,
          user: {
            connect: { id: user.id }
          }
        }
      })
      return {
        token: token,
        userId: user.id
      }
    } else {
      throw new Error('Invalid password');
    }
  }

  // async logout(token: string){
  //     return await this.db.token.update({
  //       where: { token },
  //       data: {
  //         user: {disconnect: [{}]}
  //       }
  //     })
  // }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const newData: Record<string, any> = {};
  
    if (updateUserDto.userName) {
      const existingUsername = await this.db.user.findUnique({
        where: { userName: updateUserDto.userName },
      });
      if (existingUsername) {
        throw new ConflictException('Username already in use');
      }
      newData.userName = updateUserDto.userName;
    }
  
    if (updateUserDto.password) {
      const hashedPw = await argon2.hash(updateUserDto.password);
      newData.password = hashedPw;
    }
  
    if (Object.keys(newData).length === 0) {
      throw new BadRequestException('No valid fields to update');
    }
  
    const updatedUser = await this.db.user.update({
      where: { id },
      data: newData,
    });
  
    delete updatedUser.password;
  
    return updatedUser;
  }
  

  async remove(id: number) {
    return await this.db.user.delete({
      where: { id }
    });
  }

  async findUserByToken(token: string){
    const tokenData = await this.db.token.findUnique({
      where: { token },
      include: { user: true }
    })
    if(!tokenData) return null;
    const user = tokenData.user;
    delete user.password;

    return user;
  }
}
