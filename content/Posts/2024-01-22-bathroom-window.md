---
title: "Automating the bathroom window"

date: 2024-01-22

tags: homeassistant, esphome
description: Our bathroom gets humid really fast after taking a shower and stays that way for some time. I installed an automatic window opener to solve this problem.

---

Our bathroom gets humid really fast after taking a shower and stays that way for some time. We open the window to let the
steam out, but then we have to go to work and would have to keep the window open. That's not a problem in spring or fall, but
gets too hot or too cold in summer and winter.

## Finding a solution

Then I started looking into automatic window openers, and found a cheap one on Amazon:

https://www.amazon.de/gp/product/B075F29YRT

These openers work by extending a chain that is connected to the window:

![Close-up picture of the chain drive](../../assets/windowopener-3.jpeg)

It can be controlled with two relays: one to open the window and one to close it.
I'm using a Shelly 2PM, which is essentially an ESP8266 with two relays and energy monitoring built inside.

The wiring is quite simple, but if you are not sure what you are doing, make sure to call an electrician.

This is how the window opener looks when it is installed:

![Picture of the bathroom window with the window opener installed](../../assets/windowopener-1.jpeg)

## Flashing it

For the firmware, I chose to go with the preinstalled firmware from Shelly. So no flashing this time! They have an integration for Home Assistant,
and I only had to set the device as a `cover` device to make it work correctly with the two relays. It even has an option
to automatically stop the relays if it detects the endstops of the motor triggered by measuring the power draw. This unfortunately did
not work for me, which is why I chose to use the manual timing options. Configuring one of those options allows you to set
an opening percentage if you need it.

![Screenshot of the Shelly web ui](../../assets/windowopener-shelly.png)

## Controlling it

Besides a button to open and close the window manually, I wanted to open the window automatically after taking a shower
and closing it when the humidity is back to normal. I have done this with a humidity sensor and a derivative sensor.

The derivative sensor shows the change rate of the bathroom humidity and its curve looks like this:

![Diagram of the humidity change rate](../../assets/bathroom-hum-rate.png)

In this diagram, you can clearly see that I took a shower at around 7 AM, where the humidity went up at a rate of two percent.

We can use this as a trigger to open the window: If the change rate is above two percent, open the window.
When the humidity is below 60 percent, I close the window again.

You might need to use different values than me, but you can use my configuration as a starting point and tinker from there:

![Screenshot of the derivative sensor options](../../assets/windowopener-ha.png)

## Extending it

I also have a smart thermostat, and combined with the smart window, the temperature levels are now fully automated in the
bathroom and I have one less room to worry about.
