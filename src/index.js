'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.ef071437-beb5-489f-8ec7-555dc0154fb6';
var translations = require('./translations');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.resources = defaultStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));

        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },

    'GetSlangIntent': function () {
        var itemSlot = this.event.request.intent.slots.Slang;
        var itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = this.t("DISPLAY_CARD_TITLE", this.t("SKILL_NAME"), itemName);
        var translation = translations[itemName];

        if (translation) {
            this.attributes['speechOutput'] = translation;
            this.attributes['repromtSpeech'] = this.t("SLANG_REPEAT_MESSAGE");
            // speechOutput, cardTitle, cardContent, imageObj
            this.emit(':tellWithCard', translation, cardTitle, translation);
        } else {
            var speechOutput = this.t("SLANG_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("SLANG_NOT_FOUND_REPROMPT");
            if (itemName) {
                speechOutput += this.t("SLANG_NOT_FOUND_WITH_ITEM_NAME", itemName);
            } else {
                speechOutput += this.t("SLANG_NOT_FOUND_WITHOUT_ITEM_NAME");
            }

            speechOutput += repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },

    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptOutput'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },

    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },

    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },

    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },

    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

var defaultStrings = {
    "en" : {
        "translation": {
            "SKILL_NAME": "Geordie Slang Interpreter",
            "WELCOME_MESSAGE": "Welcome to the %s, ask me about any Geordie slang and I will give you the english translation and the context in which it can be used.",
            "WELCOME_REPROMPT": "Don't be shy, I don't bite.",
            "DISPLAY_CARD_TITLE": "%s for %s.",
            "HELP_MESSAGE": "Ask me any word associated with Geordie Slang and I will translate it into the queens english and even provide you with the context in which it can be used.",
            "HELP_REPROMPT": "You can say something like what canny man mean?",
            "STOP_MESSAGE": "Goodbye.",
            "SLANG_REPEAT_MESSAGE": "Try saying repeat.",
            "SLANG_NOT_FOUND_MESSAGE": "Sorry I don't know that word.",
            "SLANG_NOT_FOUND_WITH_ITEM_NAME": " %s isn't familiar to me.",
            "SLANG_NOT_FOUND_WITHOUT_ITEM_NAME": " it isn't familiar to me.",
            "SLANG_NOT_FOUND_REPROMPT": "Ask me something else."
        }
    }
};