import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class UuidOrNull implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return (uuidValidate(value) && uuidVersion(value) === 4) || value === null;
  }
}
