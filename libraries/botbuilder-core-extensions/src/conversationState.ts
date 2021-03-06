/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { BotContext, Middleware, ActivityTypes } from 'botbuilder-core';
import { BotState, CachedBotState } from './botState';
import { Storage, StoreItem } from './storage';

const NOT_CACHED = `ConversationState: state not found. Ensure ConversationState middleware is added to adapter or ConversationState.read() has been called.`;
const NO_KEY = `ConversationState: channelId and/or conversation missing from context.request.`;

/** 
 * :package: **botbuilder-core-extensions**
 * 
 * Reads and writes conversation state for your bot to storage. When used as middleware the state 
 * will automatically be read in before your bots logic runs and then written back out open
 * completion of your bots logic.
 */
export class ConversationState<T extends StoreItem = StoreItem> extends BotState<T> {
    /**
     * Creates a new ConversationState instance. 
     * @param storage Storage provider to persist conversation state to.
     */
    constructor(storage: Storage) { 
        super(storage, (context) => {
            // Calculate storage key
            const key = this.getStorageKey(context);
            return key ? Promise.resolve(key) :  Promise.reject(new Error(NO_KEY));
        });
    }

    /**
     * Returns the storage key for the current conversation state.
     * @param context Context for current turn of conversation with the user.
     */
    public getStorageKey(context: BotContext): string|undefined {
        const req = context.request;
        const channelId = req.channelId;
        const conversationId = req && req.conversation && req.conversation.id ? req.conversation.id : undefined;
        return channelId && conversationId ? `conversation/${channelId}/${conversationId}` : undefined;
    }
}


