import { IsNotEmpty } from "class-validator";

export class SettingsDTO {

  @IsNotEmpty({message: 'settings id required'})
  id: string;

  @IsNotEmpty({message: 'settings value required'})
  value: string;
}
