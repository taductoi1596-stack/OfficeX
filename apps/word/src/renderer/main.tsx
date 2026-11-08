import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@officex/ui/src/global.css';
import { CommandDispatcher } from './CommandDispatcher';
import { HomeCommandRegistry } from './homeCommands';
import { RewriteCommands } from './ai/commands/rewriteCommands';
import { SummarizeCommands } from './ai/commands/summarizeCommands';
import { TranslateCommands } from './ai/commands/translateCommands';
import { DictateCommands } from './ai/commands/dictateCommands';
import { SpeechCommands } from './ai/commands/speechCommands';
import { VoiceCommands } from './ai/commands/voiceCommands';
import { AudioCommands } from './ai/commands/audioCommands';
import { ChatCommands } from './ai/commands/chatCommands';
import { ToolCommands } from './ai/commands/toolCommands';
import { MemoryCommands } from './ai/commands/memoryCommands';

import { ErrorBoundary } from './ErrorBoundary';

// Initialize Command Dispatcher with all registries
CommandDispatcher.registerRegistry(HomeCommandRegistry.all());
CommandDispatcher.registerRegistry(RewriteCommands);
CommandDispatcher.registerRegistry(SummarizeCommands);
CommandDispatcher.registerRegistry(TranslateCommands);
CommandDispatcher.registerRegistry(DictateCommands);
CommandDispatcher.registerRegistry(SpeechCommands);
CommandDispatcher.registerRegistry(VoiceCommands);
CommandDispatcher.registerRegistry(AudioCommands);
CommandDispatcher.registerRegistry(ChatCommands);
CommandDispatcher.registerRegistry(ToolCommands);
CommandDispatcher.registerRegistry(MemoryCommands);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
