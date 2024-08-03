---
title: Alexa connected to an audio receiver (with Home Assistant)

date: 2019-07-16

tags: Home Assistant, Node-RED, Alexa, Multiroom Audio
description: Play music on your audio receiver but let Alexa talk through it's internal speaker.

---

Shouldn't be a problem, right? Just connect your Echo device via AUX to the receiver, and voilá. But there _is_ a problem: The receiver has to be on in order to hear Alexa's responses or music.

I want to hear my music through my "good" speakers, and when they are off, I want Alexa to answer me through the "okay" speakers of my Echo Show.

## The Simple Solution

There is one rather simple solution: ditch the current receiver, and buy an Amazon Echo Link Amp. This is a receiver made by Amazon, and Alexa can play music on it. It has some inputs and outputs and should work just fine. But there is a catch: You can only connect speakers with 60W max, my speakers need 100W. And your speakers may need even more. Also, this costs around \$300.

![Echo Link Amp (about $300 on Amazon)](/content/images/2019/07/echoamp.jpg)

## My Over-Engineered Version

So here is the idea: If you put two Alexa's in a group, you can choose which one is the preferred device to play music. In my case, this will be the Amazon Echo Input, which is connected to the receiver. You can also use an Amazon Echo Link for better quality, but my ears can't tell the difference.
![](/content/images/2019/07/alexa_group_preferredspeaker.jpg)Screenshot of the Alexa App: Select Preferred Speaker
The thing missing here is that the receiver does not turn on automatically. If your receiver has the ability to detect input on a source and turn on automatically, you are finished here. If not, stay tuned.

You'll need:

- A receiver that can be turned on with Home Assistant (I have a network receiver, but you could use a Logitech Harmony to turn it on too)
- A master Echo device with a speaker, I would recommend getting an Echo Dot 3rd Gen. I'll use my Amazon Echo Show.
- An Amazon Echo Input
- Home Assistant and Node-RED (you can achieve the same using HA Automations, but I'll use Node-RED here)
- Some way of getting the media state of your Alexas. I'll use Keaton Taylor's custom component [Alexa Media Player](https://github.com/keatontaylor/alexa_media_player/) for this.

> [!info]
> Update: I created a blueprint for Home Assistant which you can use instead of the Node-RED flow,
  and you can get it here:
  [https://community.home-assistant.io/t/diy-amazon-echo-link-amp/280041](https://community.home-assistant.io/t/diy-amazon-echo-link-amp/280041)

### Automation #1: Turn the receiver on when music is played

When the Echo Input's state changes to _playing_, I want my receiver to turn on and change to the source _line3:_

<div class="full-width">![Node-RED flow for Automation #1](/content/images/2019/07/grafik.png)</div>

I also have an additional node that confirms that the receiver is on. This just prevents my network receiver from trying to turn on again, you may not need that step.

### Automation #2: Automatically turn the receiver off

Again, you may not need this step. My receiver turns off automatically after 8hrs, but I want my receiver to turn off immediately:

<div class="full-width">
  ![Node-RED flow for Automation #2](/content/images/2019/07/grafik-1.png)
</div>

When the Echo Input's state _is not_ playing, I'll wait for 10s just in case I started the music again, check if the receiver is on line3 and then turn it off. I check that because if I changed the source to `line1` or `tuner`, I do not want my receiver to turn off.

### Automation #3: Stop music when changing the source on the Receiver or turning it off

This is a quality-of-life automation. Let's say you're hearing a podcast via Alexa (your Amazon Echo Input) and then change the source to `tuner`. The podcast will continue to play and you'll lose track on where you were when you want to continue. So, I'll pause the music/podcast when changing the source of my receiver or if I turn it off manually:

<div class="full-width">
  ![Node-RED flow for Automation #3](/content/images/2019/07/grafik-4.png)
</div>

## Epilogue

I bought the Echo Input on Prime Day for \$15. I hoped that the Echo Link got discounted, but it wasn't, so I had to come up with a different solution, this solution. It also saved me \$185.

This exact setup will most likely not work for you, but the general idea might help you.
