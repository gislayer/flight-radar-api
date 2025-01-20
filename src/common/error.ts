import { 
    BadRequestException, 
    NotFoundException, 
    UnauthorizedException, 
    ForbiddenException, 
    InternalServerErrorException,
    ConflictException
 } from '@nestjs/common';
interface ErrProps{
  entity:'task'|'team'|'user'|'role'|'permission'|'permission group'|'file'|'skill';
  method:'creation'|'updating'|'deleting'|'notfound'|'bad'|'forbidden'|'access'|'any'|'login'|'validation'|'conflict'|'err';
  info:string;
}
export class Err{
    static access(text:string=''){
        throw new UnauthorizedException(`You do not have permission${text==''?'':` (${text})`}`);
    }
    static notfound(text:string=''){
        throw new NotFoundException(`Not Found!${text==''?'':` (${text})`}`);
    }
    static forbiden(text:string=''){
        throw new ForbiddenException(`Forbiden Request!${text==''?'':` (${text})`}`);
    }
    static bad(text:string=''){
        throw new BadRequestException(`Bad Request!${text==''?'':` (${text})`}`);
    }
    static send(text:string=''){
        throw new BadRequestException(`${text==''?'Bad Request!':`${text}`}`);
    }

    static SEND(obj:ErrProps){
      var method = obj.method;
      var message = "";
      switch(method){
        case 'creation':{
          message = `Unfortunately, the creation of the ${obj.entity} named ${obj.info} has failed.`;
          throw new BadRequestException(message);
        }
        case 'updating':{
          message = `Unfortunately, the update of the ${obj.entity} named ${obj.info} has failed.`;
          throw new BadRequestException(message);
        }
        case 'deleting':{
          message = `Unfortunately, the deletion of the ${obj.entity} named ${obj.info} from the system has failed.`;
          throw new BadRequestException(message);
        }
        case 'access':{
          message = `You do not have permission to perform ${obj.method} ${obj.entity}. Please contact your administrator.`;
          throw new UnauthorizedException(message);
        }
        case 'notfound':{
          message = `The ${obj.entity} named ${obj.info} could not be found in the system`;
          throw new NotFoundException(message);
        }
        case 'validation':{
          message = `The provided data is invalid. Please review the request and try again.`;
          throw new BadRequestException(message);
        }
        case 'conflict':{
          message = `The ${obj.entity} named ${obj.info} already exists. Please use a different value.`;
          throw new BadRequestException(message);
        }
        case 'bad':{
          message = `The request could not be processed. Please contact your administrator.`
          throw new BadRequestException(message);
        }
        case 'err':{
          message = `${obj.info}`;
          throw new BadRequestException(message);
        }
        case 'forbidden':{
          message = `You have made a forbidden request for ${obj.entity} ${method} without the necessary permission.`;
          throw new ForbiddenException(message);
        }
        case 'any':{
          message = `${obj.info}`;
          throw new BadRequestException(message);
        }
        default:{
          message = 'Something went wrong!'
          throw new BadRequestException(message);
        }
      }
    }
}