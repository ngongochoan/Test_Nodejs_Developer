export class ResponseUserDto {
    id: string; // uuid v4
  login: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number;
}