---
title: Monitor remaining water bottles with ESPHome and Home Assistant

date: 2019-05-07

tags: esphome, Home Assistant
description: I built a scale which sits under the water bottles crate. It measures how many bottles are left and sends a notification when I'm running low.

---

import { Image } from "astro:assets"
import logo from "../../assets/ha-logo.png"

After we ran out of sparkling water twice in a row, I decided to do something against that. The plan is to receive a notification when there are only three bottles left:

<p>
  <div class="border p-3 rounded-lg shadow-sm flex leading-tight dark:border-slate-700 dark:border-2">
    <Image src={logo} class="w-14 h-14 m-0 mr-4 rounded" alt="Home Assistant Logo" />
    <div class="">
      <div class="text-ha font-bold mb-1">Home Assistant</div>
      <div class="">
        Out of water! There are only 3 bottles of water left. You should get some new ones!
      </div>
    </div>
  </div>
</p>

# Ideas

I need a way to sense how many bottles are left. Here are some ideas I had:

- put a light sensor under each bottle in the box
- **put a scale under the crate**
- use a camera and a neural network to do some object detection

I don't know enough about neural networks and object detection, but I think this would be rather complicated and over-engineered for what I want to achieve. It may be really hard to distinguish full bottles of water from empty ones, even if I lift them slightly to check if they are full or empty. It could work for colored beverages though.

Using light sensors for each bottle is still an idea I want to check out in the future, as this solves the weight problem I'll go into in the next section.

# Why weighing the bottles may not work for you

Before we begin weighing bottles, this approach probably only works for a few plastic bottles. I put a scale under the bottles and weight them (I normalized the result by subtracting the weight of the crate). With the result, let's call it _W_, we can calculate the number of bottles like this:

$$n_{full bottles} = \lfloor\frac{W}{1070g}\rfloor$$

Those brackets mean “round the result down”. I measured that one full bottle weighs _1070g_, and one crate holds 12 bottles, so the maximum weight is _12840g_.

For my example, we will get the right result every time, because if all bottles are empty, the whole crate weighs _70g × 12 = 840g_ which is equal to zero bottles. Here is the problem: If you have glass bottles, and probably a crate of 24 bottles, this approach won't work for you. Let's assume an empty glass bottle weighs *200g. *The drink itself weighs _330g_ for a _0,33l_ bottle. Then, our formula would be:

$$n_{full bottles} = \lfloor\frac{W}{530g}\rfloor$$

For _W = 1795g_, this can either be 3 full and 1 empty bottle (1790g) or 9 empty bottles (1800g). As the scale doesn't return exact values and not every bottle weighs the same, it is impossible to tell these cases apart. If you have an idea of how to solve this, please leave a comment below.

Now we learned that weighting the bottles will only work if:

$$W_{empty bottle} \times n_{bottles} \lt W_{full bottle}$$

<p />

# Put a scale under the crate

I decided to make the scale myself and use a cheap **HX711** module from a Chinese supplier. Check out [this instructables](https://www.instructables.com/id/Arduino-Bathroom-Scale-With-50-Kg-Load-Cells-and-H/) to see how to wire them up.

![wired the scale](../../assets/scale.jpg)

I'll use ESPHome to program a WeMOS D1 Mini which is connected to the HX711.

```yaml
esphome:
  name: water_bottles
  platform: ESP8266
  board: d1_mini

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

api:
ota:
logger:

sensor:
  - platform: hx711
    name: "water_bottles_weight"
    id: water_bottles_weight
    dout_pin: D2
    clk_pin: D1
    gain: 128
    update_interval: 60s
    filters:
      - lambda: |-
          auto first_mass = 0.0; // first known mass was 0kg
          auto first_value = 25136; // value for the first known mass was 
          auto second_mass = 12840; // second mass was 
          auto second_value = 24568; // second value was
          auto r = map(x/1000, first_value, second_value, first_mass, second_mass);
          if (r > 0) return r;
          return 0;
    unit_of_measurement: g

  - platform: template
    name: "water_bottles_count"
    lambda: |-
      return floor(id(water_bottles_weight).state / 1000);
    update_interval: 60s
```

Above, you see the code on how I programmed the scale. It sends the weight and the count to home assistant, where you only need to go to _Config > Integrations > ESPHome (Add)_ and enter `water_bottles.local`. To get started with ESPHome, check out the [documentation](https://esphome.io/).

Now, you can add automations as desired. My automation reminds me to buy new water if there are fewer than 4 bottles left.

Do you have an alternative idea to achieve this? Toot me on [Mastodon](https://fosstodon.org/@vigonotion) and tell me about it.
