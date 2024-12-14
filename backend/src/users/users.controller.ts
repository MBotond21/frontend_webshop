import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, UnauthorizedException, ConflictException, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    if (!user) throw new ConflictException("Email already in use");
    return user;
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
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    const user = this.usersService.remove(+id);
    if(!user) throw new NotFoundException(`No user with id ${id} found`)
  }
}
