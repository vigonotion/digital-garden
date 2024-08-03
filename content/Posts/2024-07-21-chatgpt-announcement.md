---
date: 2024-07-21
tags:
  - homeassistant
  - chatgpt
  - ai
  - nodered
  - openai
description: Using ChatGPT, Home Assistant and Node-RED, I'll show you how to set up an automation that welcomes you home a little different each day.
title: Let ChatGPT welcome you home
---
![[Posts/ogs/risograph-image-chatgpt-announcement.png]]

Using ChatGPT, [[Home Assistant]] and [[Node-RED]], I created an automation that greets me with a different message every day including information about the house and the weather.

> Hey there! Welcome home, Celine! It's raining outside. Hopefully, you didn't get wet. Don't forget, tomorrow is a work day again, so make sure to go to bed on time. Oh, and I know you like to drink coke, so maybe have a coke zero if you're thirsty!

> [!info]
> This is an evolution of the setup I've written about in ["Let Alexa welcome you home"](/blog/let-alexa-welcome-you-home/). Check it out if you are interested in how we got here.

## Requirements

- [Home Assistant](https://home-assistant.io/)
  - [OpenAI Conversation](https://www.home-assistant.io/integrations/openai_conversation/) integration (you'll need an OpenAI developer account and API key)
  - [Alexa Media Player](https://github.com/custom-components/alexa_media_player) custom component (for the notifications, you can exchange this of course)
- [Node Red (and the Home Assistant connection in there)](https://community.home-assistant.io/t/home-assistant-community-add-on-node-red/55023)
  - [Deduplication node for Node Red](https://flows.nodered.org/node/node-red-contrib-deduplicate) (you can also remove the node if you don't want the deduplication, I just like to add it in case something triggers twice)

## Outline

The idea on how to do this is as follows:

- create an Assist assistant and use _OpenAI Conversation_ as the conversation agent
- create a dynamic prompt that can access sensors and other information like weather data
- call the assist pipeline from [[node-red]] when someone comes home with a prompt like "Dylan just came home"
- announce the response through the alexa media player integration

This might seem complex, but it is relatively easy to set up.

## Assist pipeline

In case you haven't already, set up the [OpenAI Conversation](https://www.home-assistant.io/integrations/openai_conversation/) integration. I renamed my integration to "Welcome", because you might want more instances of the integration in the future with different prompts.

Go to the settings page for voice assistants:

[![Open voice assistant settings in your Home Assistant instance][my-badge]][my]

[my-badge]: https://my.home-assistant.io/badges/voice_assistants.svg
[my]: https://my.home-assistant.io/redirect/voice_assistants/

Create a new assistant (I called mine "Welcome"):

![Screenshot of the "Add assistant" modal](add-assistant.png)

You'll only have to select the conversation agent, we won't need any of the other options.

Click the cogwheel to change the prompt.

## Prompt engineering

Now might be the hardest part: crafting a good system prompt. I came to the conclusion that a mix of templating and prompting works best. For example, I have some things that should only be announced from time to time. Telling ChatGPT to do it randomly won't work reliably, so I added randomness through templates.

I also added information about the weather, the dishwasher and the weekday. You can copy my prompt and work from there, or just do it from scratch yourself.

```jinja2
Time: {{ (now().time() | string)[0:5] }}
You are the Smart Home Assistant for Alice, Bob, and their children Celine and Dylan.
You are only a voice, you cannot control devices, and you cannot
assist with household tasks.
Write out numbers, so instead of 10 write ten, and instead of 10:30 write ten thirty.
Formulate sentences so that they are addressed to one or more persons.
Your greeting should be a maximum of 5 sentences long.
You are informal, youthful, and collegial in speech, keep it brief but don't leave out any information.
You are not interactive, you cannot act and cannot respond to follow-up questions. Formulate your announcement so
that you are not perceived as a person.
Never use phrases like "We still have to...". You never include yourself in tasks. You never write "we". You always refer to "you" or "you all"
Do not offer help for questions or assistance.
Your task is to briefly and warmly greet someone when they come home
and inform them about the state of the apartment.
Your discretion is limited to phrasing. Do not give information that you cannot be sure
is correct.
Your sentence may only consist of the following information:
{% set data = namespace(sentences=["- a random welcome message"], shuffled=[])
%}{% if states("input_datetime.staubsauger_fertig") > states("input_datetime.wohnung_verlassen")
%}{% set data.sentences = data.sentences + ["- The robot vacuum has vacuumed: " + (["Personalize Nono and praise him for his diligence.", "Sometimes he gets tangled in cables, but not today. Express praise.", "They should remember to clean the cloth and empty the dust container."]|random)]
%}{% endif %}{% if states("input_datetime.geschirrspulmaschine_fertig") > states("input_datetime.wohnung_verlassen")
%}{% set data.sentences = data.sentences + [
"""- The dishwasher is finished

If Bob has come home, subtly remind him that it's his task to unload it.
If Alice comes home, just inform her that the dishwasher is finished."""]
%}{% endif %}{% if states("vacuum.nono") in ["error", "unavailable"]
%}{% set data.sentences = data.sentences + ["- The robot vacuum has gotten stuck in the " + states("input_text.nono_raum") + ". Speculate why the robot vacuum got stuck."]
%}{% endif %}{% if states("weather.home") in ["rainy", "pouring", "hail"]
%}{% set data.sentences = data.sentences + ["- It's raining outside. Hopefully he / she didn't get wet."]
%}{% endif %}{% if states("weather.home") in ["lightning", "lightning-rainy"]
%}{% set data.sentences = data.sentences + ["- There's a thunderstorm. Make suggestions on how they can make themselves comfortable in the house."]
%}{% endif %}{% if now().weekday() == 6 and now().hour >= 20
%}{% set data.sentences = data.sentences + ["- Tomorrow is a work day again. Remind them to go to bed on time."]
%}{% endif %}{% if now().weekday() == 4 and now().hour >= 15
%}{% set data.sentences = data.sentences + ["- It's Friday afternoon. Wish them a relaxing weekend."]
%}{% endif %}{% if now().hour >= 19 and (range(1, 10) | random) >= 8
%}{% set data.sentences = data.sentences + ["- Celine likes to drink cola. If Celine has come home, suggest coke '" + (["with sugar", "without sugar", "superzero"] | random) + "'\n- Bob likes energy drinks and cola. Randomly suggest what he could drink. Remind him to drink it at room temperature so he doesn't get hiccups.\n- Alice likes coffee. Although it's late, suggest that Bob could make her a coffee."]
%}{% endif %}
{% for i in range(data.sentences | length - 1, 0, -1) %}{% set j = range(0, i + 1) | random %}{% if j != i %}{% set data.sentences = data.sentences[:j]+[data.sentences[i]]+data.sentences[j+1:i]+[data.sentences[j]]+data.sentences[i+1:] %}{% endif %}{% endfor %}
{{ data.sentences | join("\n") }}
```

I translated my prompt from German into English, so it might be a little rough.

## The [[Node-RED]] flow

Our imaginary family consists of four persons: Alice and Bob (parents), Celine and Dylan (children). Here is the [[node-red]] flow:
  ![Node Red flow (source code below)](chatgpt-announce-flow.png)

The code for the flow can be found in this [gist](https://gist.github.com/vigonotion/3474a6642cbfbe8f6ab208d5efe63399).

### Configuration

The nodes annotated with red letters will require tweaking for your requirements.

**\[4]: Filter family**

The flow will only greet your family (or any other selected group of people). You need to change the array for your family or completely remove the node if you don't want to filter at all.

**\[6]: Call conversation API**

You will need to change the id to your conversation agent. You can find it in the URL when configuring the conversation agent.

**\[8]: Trigger announcement**

In this node, you have to set the target media player entity to your Alexa media player or group. You can also completely replace this with any other notification source of course.

## Wrapping up

That's it already! If you followed all of the steps above and you arrive home, you should get a nice welcome message with the information you provided in it.

Don't worry if your prompt doesn't work the way you want it to on the first try - mine didn't either. Keep experimenting.

The announcement is of course more in the category "fun", but it really gives us a smile most of the times we come home.