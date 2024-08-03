---
title: "Using Tailscale to access Home Assistant from everywhere"

date: 2023-11-09

tags: homeassistant, tailscale
description: Tailscale provides a secure and straightforward approach to effortlessly make your Home Assistant instance available on the internet, without the complexities of router settings and VPN configuration.

---

import Callout from "../../components/Callout.astro"

When you start using Home Assistant, you'll quickly find yourself wanting to access it from everywhere, not just from your couch while being connected to the home wifi.

There are many ways to achieve this, but the easiest is problably the [Home Assistant Cloud](https://www.home-assistant.io/cloud) integration. They offer a subscription based service that also allows you to easily integrate Amazon Alexa and Google Assistant.

But the great thing about Home Assistant is that they allow you to do things more than one way, and there are actually even more ways to open your Home Assistant instance to the internet. I'll just briefly mention that you can open a port on your router and use a service like DuckDNS to give you a URL to access Home Assistant, but this is hard to make right regarding security and is sometimes even impossible if your ISP only issues IP v6 addresses or has a double NAT setup. If you've never heard of these things, be prepared for a long journey - or use Home Assistant Cloud or the Tailscale method this post is about.

> [!info]
> If you chose this method and don't need the other features Home Assistant Cloud offers, consider
subscribing anyway! By subscribing, you help fund the development of Home Assistant.


## What is Tailscale

Their headline says "Tailscale makes networking easy". And that's not an understatement. If you've worked with router configurations, VPNs, secret keys, SSL certificates and all those things before, you'll appreciate how easy and fast it is to connect devices and services using Tailscale.

The core feature of Tailscale is a VPN, where you can connect devices without actually having to do all the networking normally required.
If you've never heard of Tailscale before, I recommend reading [What is Tailscale?](https://tailscale.com/kb/1151/what-is-tailscale/) from their documentation. If, after reading this article, you decide that you want to use Tailscale, you can read their [Quickstart](https://tailscale.com/kb/1017/install/) guide which leads you through creating an account and adding a machine to it.

Here is a Screenshot of my tailnet:

![Screenshot showing the admin ui of Tailscale, showing 10 machines like homeassistant, an apple tv and a macbook-pro.](../../assets/vigo-tailnet.png)

From now on, I'll assume that you have a Tailscale account with your computer connected to your tailnet (their name for the VPN all your devices are in).

A newer feature of Tailscale is _Tailscale Funnel_, which allows you to access a service from your tailnet via the public internet. This is what we'll use to make Home Assistant accessible from the internet.

## What to expect

We'll setup Home Assistant to join your tailnet, configure Tailscale, and then make Home Assistant available on a URL that looks like this: `https://homeassistant.yak-bebop.ts.net`.

## Configuring Tailscale

We'll need to change some things in the Tailscale admin console. First, you'll have to enable HTTPS support, which you can do by following their guide [Enabling HTTPS](https://tailscale.com/kb/1153/enabling-https/).
Next, we will enable Tailscale Funnel. For this, follow their guide [Tailscale Funnel](https://tailscale.com/kb/1223/funnel/) on how to edit the _tailnet policy file_. For me, it was as simple as pressing a button on the right side of the code editor there, but editing the file by hand is not much harder.

That's it already for this part.

## Adding Home Assistant to your tailnet

Start by opening the addon store and install the Tailscale addon.

[![Open this add-on in your Home Assistant instance.][addon-badge]][addon]

After installing, go to configuration, click on the three dots in the top right corner and edit as YAML. There, you can paste this config:

```yaml
funnel: true
proxy: true
userspace_networking: false
```

Click save, then start the addon. Open the web ui of the Tailscale addon and authenticate.

Congratulations, your Home Assistant instance is now part of your tailnet and available from the internet.

![Screenshot of the web ui of the Tailscale addon, showing Home Assistant is connected to Tailscale](../../assets/ha-ts-connected.png)

Check the logs for an entry that looks like this to find out the address:

```logs
[20:51:32] INFO: Tailscale Funnel is enabled:
[20:51:32] INFO:   Your Home Assistant instance is publicly available on the internet at
[20:51:32] INFO:   https://homeassistant.yak-bebop.ts.net
```

You can now connect to Home Assistant from everywhere:

![Screenshot showing the admin ui of Tailscale, showing 10 machines like homeassistant, an apple
tv and a macbook-pro.](../../assets/ha-reachable.png)

## Wrapping up

We now have an easy and secure way to connect to a Home Assistant instance via the internet "without fiddling with router settings or ssl certificates" (although still more steps than Home Assistant Cloud).

You can also configure the Tailscale addon to act as an exit node, which enables you to access other devices on the same network that are not part of the tailnet via any machine connected to the tailnet. Check out the [addon documentation](https://github.com/hassio-addons/addon-tailscale/blob/main/tailscale/DOCS.md) for more info on that.

[addon-badge]: https://my.home-assistant.io/badges/supervisor_addon.svg
[addon]: https://my.home-assistant.io/redirect/supervisor_addon/?addon=a0d7b954_tailscale&repository_url=https%3A%2F%2Fgithub.com%2Fhassio-addons%2Frepository
