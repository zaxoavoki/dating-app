import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateNameUserDto } from './dto/update-name-user.dto';
import { UpdateAvatarUserDto } from './dto/update-avatar-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { UpdateInformationDto } from 'src/informations/dto/update-information.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { RelationUserDto } from './dto/relation-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findMany() {
    return this.usersService.findMany('-password');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id/avatar')
  @Roles(Role.Admin)
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarUserDto: UpdateAvatarUserDto,
  ) {
    return this.usersService.updateAvatar(id, updateAvatarUserDto);
  }

  @Patch(':id/password')
  @Roles(Role.Admin)
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ) {
    return this.usersService.updatePassword(id, updatePasswordUserDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  updateName(
    @Param('id') id: string,
    @Body() updateNameUserDto: UpdateNameUserDto,
  ) {
    console.log(updateNameUserDto);
    return this.usersService.updateName(id, updateNameUserDto);
  }

  @Patch(':id/information')
  @Roles(Role.Admin)
  updateInformation(
    @Param('id') id: string,
    @Body() updateInformationDto: UpdateInformationDto,
  ) {
    console.log(updateInformationDto);
    return this.usersService.updateInformation(id, updateInformationDto);
  }

  @Patch('action')
  makeActionWithUser(@Body() relationUserDto: RelationUserDto) {
    return this.usersService.makeActionWithUser(relationUserDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
