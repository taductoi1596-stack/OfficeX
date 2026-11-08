import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiSummarizeDto, AiTranslateDto, AiSuggestDto } from './dto/ai-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('summarize')
  async summarize(@Body() dto: AiSummarizeDto) {
    const result = await this.aiService.summarize(dto.text);
    return { data: result };
  }

  @Post('translate')
  async translate(@Body() dto: AiTranslateDto) {
    const result = await this.aiService.translate(dto.text, dto.targetLanguage);
    return { data: result };
  }

  @Post('suggest')
  async suggest(@Body() dto: AiSuggestDto) {
    const result = await this.aiService.suggest(dto.context);
    return { data: result };
  }
}
