"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-dialogs
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const botbuilder_1 = require("botbuilder");
class DialogContext {
    /**
     * Creates a new DialogContext instance.
     * @param dialogs Parent dialog set.
     * @param context Context for the current turn of conversation with the user.
     * @param stack Current dialog stack.
     */
    constructor(dialogs, context, stack) {
        this.dialogs = dialogs;
        this.context = context;
        this.stack = stack;
        this.batch = new botbuilder_1.BatchOutput(context);
    }
    /** Returns the cached instance of the active dialog on the top of the stack or `undefined` if the stack is empty. */
    get instance() {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
    }
    /**
     * Pushes a new dialog onto the dialog stack.
     *
     * **Example usage:**
     *
     * ```JavaScript
     * const dc = dialogs.createContext(context, stack);
     * return dc.begin('greeting', user);
     * ```
     * @param dialogId ID of the dialog to start.
     * @param dialogArgs (Optional) additional argument(s) to pass to the dialog being started.
     */
    begin(dialogId, dialogArgs) {
        try {
            // Lookup dialog
            const dialog = this.dialogs.find(dialogId);
            if (!dialog) {
                throw new Error(`DialogContext.begin(): A dialog with an id of '${dialogId}' wasn't found.`);
            }
            // Push new instance onto stack. 
            const instance = {
                id: dialogId,
                state: {}
            };
            this.stack.push(instance);
            // Call dialogs begin() method.
            return Promise.resolve(dialog.dialogBegin(this, dialogArgs)).then((r) => this.ensureDialogResult(r));
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Helper function to simplify formatting the options for calling a prompt dialog. This helper will
     * construct a `PromptOptions` structure and then call [begin(context, dialogId, options)](#begin).
     *
     * **Example usage:**
     *
     * ```JavaScript
     * return dc.prompt('confirmPrompt', `Are you sure you'd like to quit?`);
     * ```
     * @param O (Optional) type of options expected by the prompt.
     * @param dialogId ID of the prompt to start.
     * @param prompt Initial prompt to send the user.
     * @param choicesOrOptions (Optional) array of choices to prompt the user for or additional prompt options.
     */
    prompt(dialogId, prompt, choicesOrOptions, options) {
        const args = Object.assign({}, Array.isArray(choicesOrOptions) ? { choices: choicesOrOptions } : choicesOrOptions);
        if (prompt) {
            args.prompt = prompt;
        }
        return this.begin(dialogId, args);
    }
    /**
     * Continues execution of the active dialog, if there is one, by passing the context object to
     * its `Dialog.continue()` method. You can check `context.responded` after the call completes
     * to determine if a dialog was run and a reply was sent to the user.
     *
     * **Example usage:**
     *
     * ```JavaScript
     * const dc = dialogs.createContext(context, dialogStack);
     * return dc.continue().then(() => {
     *      if (!context.responded) {
     *          return dc.begin('fallback');
     *      }
     * });
     * ```
     */
    continue() {
        try {
            // Check for a dialog on the stack
            const instance = this.instance;
            if (instance) {
                // Lookup dialog
                const dialog = this.dialogs.find(instance.id);
                if (!dialog) {
                    throw new Error(`DialogSet.continue(): Can't continue dialog. A dialog with an id of '${instance.id}' wasn't found.`);
                }
                // Check for existence of a continue() method
                if (dialog.dialogContinue) {
                    // Continue execution of dialog
                    return Promise.resolve(dialog.dialogContinue(this)).then((r) => this.ensureDialogResult(r));
                }
                else {
                    // Just end the dialog
                    return this.end();
                }
            }
            else {
                return Promise.resolve({ active: false });
            }
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Ends a dialog by popping it off the stack and returns an optional result to the dialogs
     * parent. The parent dialog is the dialog the started the on being ended via a call to
     * either [begin()](#begin) or [prompt()](#prompt).
     *
     * The parent dialog will have its `Dialog.resume()` method invoked with any returned
     * result. If the parent dialog hasn't implemented a `resume()` method then it will be
     * automatically ended as well and the result passed to its parent. If there are no more
     * parent dialogs on the stack then processing of the turn will end.
      *
     * **Example usage:**
     *
     * ```JavaScript
     * dialogs.add('showUptime', [
     *      function (dc) {
     *          const elapsed = new Date().getTime() - started;
     *          dc.batch.reply(`I've been running for ${elapsed / 1000} seconds.`);
     *          return dc.end(elapsed);
     *      }
     * ]);
     * const started = new Date().getTime();
     * ```
     * @param result (Optional) result to pass to the parent dialogs `Dialog.resume()` method.
     */
    end(result) {
        try {
            // Pop active dialog off the stack
            if (this.stack.length > 0) {
                this.stack.pop();
            }
            // Resume previous dialog
            const instance = this.instance;
            if (instance) {
                // Lookup dialog
                const dialog = this.dialogs.find(instance.id);
                if (!dialog) {
                    throw new Error(`DialogContext.end(): Can't resume previous dialog. A dialog with an id of '${instance.id}' wasn't found.`);
                }
                // Check for existence of a resumeDialog() method
                if (dialog.dialogResume) {
                    // Return result to previous dialog
                    return Promise.resolve(dialog.dialogResume(this, result)).then((r) => this.ensureDialogResult(r));
                }
                else {
                    // Just end the dialog and pass result to parent dialog
                    return this.end(result);
                }
            }
            else {
                return Promise.resolve({ active: false, result: result });
            }
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    /**
     * Deletes any existing dialog stack thus cancelling all dialogs on the stack.
     *
     * **Example usage:**
     *
     * ```JavaScript
     * await dc.endAll().begin('bookFlightTask');
     * ```
     */
    endAll() {
        // Cancel any active dialogs
        if (this.stack.length > 0) {
            this.stack.splice(0, this.stack.length - 1);
        }
        return this;
    }
    /**
     * Ends the active dialog and starts a new dialog in its place. This is particularly useful
     * for creating loops or redirecting to another dialog.
     *
     * **Example usage:**
     *
     * ```JavaScript
     * dialogs.add('loop', [
     *      function (dc, args) {
     *          dc.instance.state = args;
     *          return dc.begin(args.dialogId);
     *      },
     *      function (dc) {
     *          const args = dc.instance.state;
     *          return dc.replace('loop', args);
     *      }
     * ]);
     * ```
     * @param dialogId ID of the new dialog to start.
     * @param dialogArgs (Optional) additional argument(s) to pass to the new dialog.
     */
    replace(dialogId, dialogArgs) {
        try {
            // Pop stack
            if (this.stack.length > 0) {
                this.stack.pop();
            }
            // Start replacement dialog
            return this.begin(dialogId, dialogArgs);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    ensureDialogResult(result) {
        return typeof result === 'object' && typeof result.active === 'boolean' ? result : { active: this.stack.length > 0 };
    }
}
exports.DialogContext = DialogContext;
//# sourceMappingURL=dialogContext.js.map