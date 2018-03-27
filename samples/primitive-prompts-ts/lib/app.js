"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const restify = require("restify");
// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});
// Create adapter
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Add conversation state middleware
const conversationState = new botbuilder_1.ConversationState(new botbuilder_1.MemoryStorage());
adapter.use(conversationState)
    .use((context, next) => __awaiter(this, void 0, void 0, function* () {
    yield context.sendActivity("{");
    yield next();
    yield context.sendActivity("}");
}));
// Listen for incoming requests 
server.post(`/api/messages`, (req, res) => {
    // Route received request to adapter for processing
    adapter.processRequest(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        if (context.request.type === `message`) {
            // Get state for this turn 
            const state = conversationState.get(context);
            // Check to see if we are actively in any prompts
            if (state.activePrompt) {
                switch (state.activePrompt) {
                    // Set state respective to the prompt that we're in 
                    case `namePrompt`:
                        state.name = context.request.text;
                        break;
                    case `agePrompt`:
                        state.age = parseInt(context.request.text);
                        break;
                }
                // End prompt, since we successfully gathered our state
                state.activePrompt = undefined;
            }
            // Prompt for name if we don't have it
            if (!state.name) {
                state.activePrompt = `namePrompt`;
                return context.sendActivity(`What is your name?`);
            }
            // Prompt for age if we don't have it
            if (!state.age) {
                state.activePrompt = `agePrompt`;
                return context.sendActivity(`How old are you?`);
            }
            // Now that we have age and name, greet the user!
            return context.sendActivity(`Hello ${state.name}! You are ${state.age} years old.`);
        }
    }));
});
//# sourceMappingURL=app.js.map