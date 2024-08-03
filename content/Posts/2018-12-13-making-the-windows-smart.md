---
title: Making the windows smart

date: 2018-12-13

tags: Home Assistant, ESPHome
description: We will add magnet contacts to every window and wire them all to an ESP8266. Then, we flash a sketch with esphomeyaml to connect everything to home assistant.

---

Having your windows connected to home assistant opens many possibilities. I've written down some ideas on what you could do with such information:

- 🚨 Create an alarm panel, so when a window is being opened while you are away, the siren rings and you get a text message
- 📱 Be notified which windows are still open before you leave
- 🌡️ Turn off the heater when someone opens a window
- ❄️ Ring a bell when the windows are open for too long
- ... and possibly much more


Af the end of this post, your dashboard might look like this:

![climate card: heater control and binary sensors for each window in home assistant](/content/images/2018/12/climate_card.png)

## Prerequisites

- basic knowledge of [home assistant](https://www.home-assistant.io/)
- [esphome](https://esphome.io) installed
- an esp8266 and a reed contact switch

![magnetic window contact and a nodemcu](/content/images/2018/12/window_parts-1.jpg)


## How to do this

We will add magnet contacts to every window and wire them all to an ESP8266. There are other possibilities like using wireless contacts, but if you are on a budget or already have sensors pre-wired in your home this is a cheap and reliable way.

Let's begin with wiring everything together. The magnet contacts close the circuit when the magnet is near them, and is open when not. We will connect one wire of the contact to a digital pin. Not all pins are usable as inputs on the NodeMCU board, so make sure to connect to one of these pins: D0, D1, D2, D5, D6 or D7. You don't have to use four window contacts as I do but if you want to connect more than six you probably need to use a shift register to get more ports (or use another node).

![four window contacts wired to a nodemcu](/content/images/2018/12/connected_windows_breadboard-1.png)


### Writing the program

Using esphomeyaml, flashing the nodemcu becomes a no-brainer. If you already know yaml files from home assistant, it should be easy for you to follow.

Keep in mind to alter the pins to your chosen ones. If you want to add contacts, just copy one of them and make sure all the indents are correct.

```yaml
esphomeyaml:
  name: window_contacts
  platform: ESP8266
  board: nodemcuv2

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

## Enable logging
logger:

ota:

api:

binary_sensor:
  - platform: gpio
    pin:
      number: D1
      mode: INPUT_PULLUP
    name: "Small Window"
    device_class: window

  - platform: gpio
    pin:
      number: D2
      mode: INPUT_PULLUP
    name: "Balcony Door"
    device_class: window

  - platform: gpio
    pin:
      number: D6
      mode: INPUT_PULLUP
    name: "Wide Window"
    device_class: window

  - platform: gpio
    pin:
      number: D7
      mode: INPUT_PULLUP
    name: "Side Window"
    device_class: window
```

Connect everything and run `esphomeyaml window_contacts.yaml run`.

To add the entities to your home assistant instance, visit [https://www.home-assistant.io/components/esphome/](https://www.home-assistant.io/components/esphome/). 

## TL;DR

We connected simple reed switches (window contacts) to a nodemcu (esp8266). We then wrote a simple program using esphomeyaml to report the states to home assistant. After uploading this sketch, everything should be up and running fine.
