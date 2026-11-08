import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AiSummarizeDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class AiTranslateDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  targetLanguage: string;
}

export class AiSuggestDto {
  @IsString()
  @IsNotEmpty()
  context: string;
}
