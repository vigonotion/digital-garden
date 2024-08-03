---
title: Let Alexa welcome you home

date: 2020-06-26

tags: Alexa, Home Assistant, Node-RED
description: Using Home Assistant and Node-RED, I created an automation that not only greets me when I come home but also tells me who is home and who is away (and how long).

---

Using Home Assistant and Node-RED, I created an automation that not only greets me when I come home but also tells me who is home and who is away (and how long).

> Welcome back, Celine. Dylan and Mom are also at home. Dad left two hours ago.

## Requirements

- [Home Assistant](https://home-assistant.io/)
- [Node Red (and the Home Assistant connection in there)](https://community.home-assistant.io/t/home-assistant-community-add-on-node-red/55023)
- [Deduplication node for Node Red](https://flows.nodered.org/node/node-red-contrib-deduplicate) (you can also remove the node if you don't want the deduplication, I just like to add it in case something triggers twice)
- [Alexa Media Player](https://github.com/custom-components/alexa_media_player) custom component (for the notifications)

## The flow

Our imaginary family consists of four persons: Alice and Bob (parents), Celine and Dylan (children). Here is my flow:

<div class="full-width">
  ![Node Red flow (source code below)](/content/images/2020/06/nodered-1.png)
</div>

### Configuration

The nodes annotated with red letters will require tweaking for your requirements.

**C: Filter family**

The flow will only greet your family (or any other selected group of people). You need to change the array for your family or completely remove the node if you don't want to filter at all.

**D: Front door opened**

Change the binary sensor to your door sensor (or any other sensor you want to trigger the greeting by)

**G: Create message**

Here you can change all the texts that are used for the greeting. It should be easy to localize it for your language, and English and German strings are available already.

A really cool feature I think is the relations map. Children normally don't call their parents by name but by "Mom", "Dad", and so on. So with the relation map, you can override the friendly name for the kids.

```js
let relations = {
  "person.celine": {
    "person.alice": "Mom",
    "person.bob": "Dad",
  },
  "person.dylan": {
    "person.alice": "Mom",
    "person.bob": "Dad",
  },
}
```

**H: Alexa**

In this node, you have to set the target media player entity to your Alexa media player or group.

## Extending it further

In the future, I'd like to know if the dishwasher, washing machine or tumble dryer finished while nobody was home. If you have access to the calendars or location of your family in Home Assistant, it could also be nice to tell not only who is not home, but where. If you have more ideas or wrote something cool, please write it in the comments below and I may add it to the post.
