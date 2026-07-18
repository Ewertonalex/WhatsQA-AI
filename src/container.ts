import { ChatService } from './services/ChatService';
import { CommandParserService } from './services/CommandParserService';
import { CommandRouterService } from './services/CommandRouterService';
import { ContextBuilderService } from './services/ContextBuilderService';
import { ConversationService } from './services/ConversationService';
import { MessageOrchestratorService } from './services/MessageOrchestratorService';
import { MetricsService } from './services/MetricsService';
import { OpenAIService } from './services/OpenAIService';
import { UserService } from './services/UserService';
import { UsageService } from './services/UsageService';
import { ApiCommandService } from './services/commands/ApiCommandService';
import { BddCommandService } from './services/commands/BddCommandService';
import { BugCommandService } from './services/commands/BugCommandService';
import { ChecklistCommandService } from './services/commands/ChecklistCommandService';
import { CypressCommandService } from './services/commands/CypressCommandService';
import { ExplainCommandService } from './services/commands/ExplainCommandService';
import { HelpCommandService } from './services/commands/HelpCommandService';
import { PlanCommandService } from './services/commands/PlanCommandService';
import { PostmanCommandService } from './services/commands/PostmanCommandService';
import { RegressionCommandService } from './services/commands/RegressionCommandService';
import { RiskCommandService } from './services/commands/RiskCommandService';
import { SqlCommandService } from './services/commands/SqlCommandService';
import { StoryCommandService } from './services/commands/StoryCommandService';
import { SwaggerCommandService } from './services/commands/SwaggerCommandService';
import { TestCommandService } from './services/commands/TestCommandService';
import { CommandRepository } from './repositories/CommandRepository';
import { ConversationRepository } from './repositories/ConversationRepository';
import { HistoryRepository } from './repositories/HistoryRepository';
import { LogRepository } from './repositories/LogRepository';
import { MessageRepository } from './repositories/MessageRepository';
import { PreferenceRepository } from './repositories/PreferenceRepository';
import { SessionRepository } from './repositories/SessionRepository';
import { UsageRepository } from './repositories/UsageRepository';
import { UserRepository } from './repositories/UserRepository';

export interface AppContainer {
  messageOrchestrator: MessageOrchestratorService;
  metricsService: MetricsService;
  usageService: UsageService;
  sessionRepository: SessionRepository;
}

export function createContainer(): AppContainer {
  const userRepository = new UserRepository();
  const messageRepository = new MessageRepository();
  const conversationRepository = new ConversationRepository();
  const commandRepository = new CommandRepository();
  const historyRepository = new HistoryRepository();
  const preferenceRepository = new PreferenceRepository();
  const sessionRepository = new SessionRepository();
  const logRepository = new LogRepository();
  const usageRepository = new UsageRepository();

  const openAIService = new OpenAIService(usageRepository, logRepository);
  const userService = new UserService(userRepository);
  const conversationService = new ConversationService(conversationRepository);
  const contextBuilder = new ContextBuilderService(messageRepository, historyRepository);
  const chatService = new ChatService(
    openAIService,
    contextBuilder,
    messageRepository,
    historyRepository,
  );
  const usageService = new UsageService(usageRepository);
  const metricsService = new MetricsService(
    userRepository,
    messageRepository,
    usageRepository,
    commandRepository,
    logRepository,
  );

  const bugCommand = new BugCommandService(
    openAIService,
    historyRepository,
    conversationService,
  );
  const regressionCommand = new RegressionCommandService(
    openAIService,
    historyRepository,
    preferenceRepository,
    conversationService,
  );

  const handlers = [
    new HelpCommandService(),
    bugCommand,
    new TestCommandService(openAIService, historyRepository),
    new BddCommandService(openAIService, historyRepository),
    new ApiCommandService(openAIService, historyRepository),
    new SqlCommandService(openAIService, historyRepository),
    new CypressCommandService(openAIService, historyRepository),
    new PostmanCommandService(openAIService, historyRepository),
    regressionCommand,
    new ChecklistCommandService(openAIService, historyRepository),
    new PlanCommandService(openAIService, historyRepository),
    new RiskCommandService(openAIService, historyRepository),
    new StoryCommandService(openAIService, historyRepository),
    new SwaggerCommandService(openAIService, historyRepository),
    new ExplainCommandService(openAIService, historyRepository),
  ];

  const parser = new CommandParserService();
  const router = new CommandRouterService(
    handlers,
    commandRepository,
    conversationService,
    bugCommand,
    regressionCommand,
  );

  const messageOrchestrator = new MessageOrchestratorService(
    userService,
    messageRepository,
    parser,
    router,
    chatService,
  );

  return {
    messageOrchestrator,
    metricsService,
    usageService,
    sessionRepository,
  };
}
