import * as bcrypt from 'bcrypt';
import { Document, Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/users.schema';
import { ConfigService } from '@nestjs/config';
import { UpdateNameUserDto } from './dto/update-name-user.dto';
import { UpdateAvatarUserDto } from './dto/update-avatar-user.dto';
import { InformationsService } from 'src/informations/informations.service';
import { UpdateInformationDto } from 'src/informations/dto/update-information.dto';
import { RelationUserDto } from './dto/relation-user.dto';
import { Information } from '../informations/interfaces/informations.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
    private informationsService: InformationsService,
    private configServer: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (await this.findOneByEmail(createUserDto.email)) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    createUserDto.password = bcrypt.hashSync(
      createUserDto.password,
      parseInt(this.configServer.get<string>('BCRYPT_SALT_ROUNDS', '12')),
    );
    const user = await this.usersModel.create(createUserDto);
    const information = await this.informationsService.create({});
    user.information = information;
    return await user.save();
  }

  findMany(projection = '') {
    return this.usersModel.find({}, projection);
  }

  findOneByEmail(email: string, projection = '') {
    return this.usersModel.findOne({ email }, projection);
  }

  async updateName(id: string, updateNameUserDto: UpdateNameUserDto) {
    const user = await this.findOneById(id);
    for (const [key, value] of Object.entries(updateNameUserDto)) {
      user[key] = value;
    }
    await user.save();
    user.password = undefined;
    return user;
  }

  async updateInformation(
    id: string,
    updateInformationDto: UpdateInformationDto,
  ) {
    const user = await this.findOneById(id, '-password');
    const informationId = user.information as Information & Document;
    const information = await this.informationsService.update(
      String(informationId.id),
      updateInformationDto,
    );
    if (!information) {
      throw new HttpException(
        'Information was not updated',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    user.completeSignup = true;
    await user.save();
    return await user.populate('information').execPopulate();
  }

  async updateAvatar(id: string, updateAvatarUserDto: UpdateAvatarUserDto) {
    const user = await this.findOneById(id, '-password');
    user.avatar = updateAvatarUserDto.avatar;
    return await user.save();
  }

  findOneById(id: string, projection = '-password -liked -disliked -saved') {
    return this.usersModel.findById(id, projection).populate('information');
  }

  async remove(id: string) {
    const user = await this.usersModel.findByIdAndDelete(id, {
      projection: '-password',
    });
    await this.informationsService.remove(String(user.information));
    user.information = undefined;
    return user;
  }

  async makeActionWithUser(relationUserDto: RelationUserDto) {
    const { targetId, likerId, action } = relationUserDto;
    const liker = await this.findOneById(likerId);
    const target = await this.findOneById(targetId);

    if (!liker || !target) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (liker.liked.includes(target) || liker.disliked.includes(target)) {
      throw new HttpException(
        'You have already liked or disliked this user',
        HttpStatus.CONFLICT,
      );
    }

    if (action === 'like') {
      liker.liked.push(target);
    } else {
      liker.disliked.push(target);
    }

    return await liker.save();
  }
}
