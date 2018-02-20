import { Activity, Middleware, ConversationResourceResponse } from 'botbuilder';
export declare class TestMiddleware2 implements Middleware {
    contextCreated(context: BotContext, next: () => Promise<void>): Promise<void>;
    receiveActivity(context: BotContext, next: () => Promise<void>): Promise<void>;
    postActivity(context: BotContext, activities: Partial<Activity>[], next: () => Promise<ConversationResourceResponse[]>): Promise<ConversationResourceResponse[]>;
}
