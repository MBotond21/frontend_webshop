import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, UnauthorizedException, ConflictException, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { LogoutDto } from './dto/logout-dto';
import { error } from 'console';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try{
      const user = await this.usersService.create(createUserDto);
      return user;
    }catch(e){
      throw new ConflictException(e.message)
    }
  }

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    try {
      return await this.usersService.login(loginData);
    } catch {
      throw new UnauthorizedException("Érvénytelen név vagy jelszó!")
    }
  }

  @Get()
  @UseGuards(AuthGuard('bearer'))
  findAll(@Request() request) {
    console.log(request.user);
    return request.user;
  }

  @Get(':id(\\d+)')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id(\\d+)')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id(\\d+)')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    const user = this.usersService.remove(+id);
    if (!user) throw new NotFoundException(`No user with id ${id} found`)
  }

  // @Delete('logout/:id')
  // @HttpCode(200)
  // async logout(@Body() logoutDto: LogoutDto) {
  //   try {
  //     const token = await this.usersService.logout(logoutDto.token);
  //     if (!token) throw new NotFoundException('No token found');
  //   }catch(e){
  //     console.log(e)
  //   }
  // }
}