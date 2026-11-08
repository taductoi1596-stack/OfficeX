export * from './gateway/AIGateway';
export * from './providers/MockAIProvider';
export * from './providers/LocalLLMProvider';

import { AIGateway } from './gateway/AIGateway';
import { LocalLLMProvider } from './providers/LocalLLMProvider';

export const aiGateway = new AIGateway();
aiGateway.registerProvider(new LocalLLMProvider());
