/**
 * @module botbuilder-toybox-prompts
 */
/** Licensed under the MIT License. */
import { Activity, Attachment } from 'botbuilder';
import { PromptValidator } from './textPrompt';
/** Prompts the user to upload one or more attachments. */
export interface AttachmentPrompt<O = Attachment[]> {
    /**
     * Sends a formated prompt to the user.
     * @param context Context for the current turn of conversation.
     * @param prompt Text or activity to send as the prompt.
     * @param speak (Optional) SSML that should be spoken for prompt. The prompts `inputHint` will be automatically set to `expectingInput`.
     */
    prompt(context: BotContext, prompt: string | Partial<Activity>, speak?: string): Promise<void>;
    /**
     * Recognizes and validates the users reply.
     * @param context Context for the current turn of conversation.
     */
    recognize(context: BotContext): Promise<O | undefined>;
}
/**
 * Creates a new prompt that asks the user to upload one or more attachments.
 * @param validator (Optional) validator for providing additional validation logic or customizing the prompt sent to the user when invalid.
 */
export declare function createAttachmentPrompt<O = Attachment[]>(validator?: PromptValidator<Attachment[], O>): AttachmentPrompt<O>;
