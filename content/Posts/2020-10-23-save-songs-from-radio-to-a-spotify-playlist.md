---
title: Save songs from radio to a Spotify playlist

date: 2020-10-22

tags: Home Assistant, Node-RED, Spotify
description: I like to listen to the radio, and sometimes I want to save the songs I hear there to a Spotify playlist. That process was kind of tedious, so I thought I automate that process.

---

I like to listen to the radio, and sometimes I want to save the songs I hear there to a Spotify playlist. That process was kind of tedious, as I had to go to the website of my radio station and look up the song name, then open Spotify, search the song and add it to my playlist. So I thought I automate that process.

## Prerequisites

I built this using Home Assistant and Node-RED. If you don't know these, it's worth checking them out if you are into home automation and automation in general.

For the setup, I assume that you have Home Assistant and Node-RED already up and running and know how to configure both of them.

## The setup

The first step was to get the track and artist name from my radio station. They use a simple, undocumented REST API which I created a [rest sensor in Home Assistant](https://www.home-assistant.io/integrations/rest/) for. Your radio station might also have this, you could use the scrape integration or maybe your Home Assistant Media Player component shows the information.

```yaml
sensor:
  - platform: rest
    name: "Deutschlandfunk Nova"
    resource: https://www.deutschlandfunknova.de/actions/dradio/playlist/onair
    scan_interval: 10
    value_template: '{% if value_json.playlistItem["stoptime"] and value_json.playlistItem["stoptime"]|int > as_timestamp(now())|int %}{{ value_json.playlistItem["title"] }} von {{ value_json.playlistItem["artist"] }}{% else %}{{ value_json.show["title"] }} mit {{ value_json.presenter["displayname"] }}{% endif %}'
    json_attributes_path: '$.playlistItem'
    json_attributes:
      - title
      - artist
      - type
      - starttime
      - stoptime
      - length
      - cover
```
    

I build my automation with Node-RED, because I needed a simple way to communicate with the Spotify API. As Home Assistant's Spotify component only allows basic player controls and not advanced features like searching for tracks and adding them to playlists, I couldn't write this automation directly via Home Assistant.

![The Node-RED flow](../../assets/spotify-flow.png)

To use this setup, install [node-red-contrib-spotify](https://flows.nodered.org/node/node-red-contrib-spotify) and set it up according to the documentation.

The Spotify API needs the following scopes: `playlist-modify-public,playlist-modify-private`

Here is the source code:

```json
[{"id":"eba7a53b.aa0528","type":"api-current-state","z":"67e61191.8e91a","name":"Get current song","server":"e02cc9b7.16ead8","version":1,"outputs":1,"halt_if":"","halt_if_type":"str","halt_if_compare":"is","override_topic":false,"entity_id":"sensor.deutschlandfunk_nova","state_type":"str","state_location":"payload","override_payload":"msg","entity_location":"data","override_data":"msg","blockInputOverrides":false,"x":410,"y":460,"wires":[["62d1c611.9ec1f"]]},{"id":"62d1c611.9ec1f","type":"function","z":"67e61191.8e91a","name":"Check if music is playing","func":"if(msg.data.attributes[\"type\"] == \"Music\")\n{\n    return [msg, null]\n}\n\n\nreturn [null, msg];","outputs":2,"noerr":0,"x":650,"y":460,"wires":[["7a89d1be.4f3c5"],[]],"outputLabels":["","Error"]},{"id":"e3aaf0e4.928128","type":"spotify","z":"67e61191.8e91a","name":"","auth":"84fdd5d0.f8b7a8","api":"searchTracks","x":600,"y":540,"wires":[["8868cbc7.7dfe7"]]},{"id":"7a89d1be.4f3c5","type":"function","z":"67e61191.8e91a","name":"Prepare search","func":"// The search term will be \"title + artist\" which works for all my testet cases.\n\nmsg.params = [\n    msg.data.attributes[\"title\"] + \" \" + msg.data.attributes[\"artist\"],\n];\nreturn msg;","outputs":1,"noerr":0,"x":400,"y":540,"wires":[["e3aaf0e4.928128"]]},{"id":"23a8a19b.41e486","type":"spotify","z":"67e61191.8e91a","name":"","auth":"84fdd5d0.f8b7a8","api":"addTracksToPlaylist","x":640,"y":600,"wires":[[]]},{"id":"8868cbc7.7dfe7","type":"function","z":"67e61191.8e91a","name":"Prepare track addition","func":"let track = msg.payload.tracks.items[0].uri;\n\nmsg.params = [\n    \"PLAYLISTIDHERE\", // Spotify-ID of the playlist you want to add the track to\n    [track],\n    //\"track\"\n];\nreturn msg;","outputs":1,"noerr":0,"x":420,"y":600,"wires":[["23a8a19b.41e486"]]},{"id":"abbdf6ca.804a1","type":"server-events","z":"67e61191.8e91a","name":"","server":"e02cc9b7.16ead8","event_type":"nodered:dlftospotify","exposeToHomeAssistant":false,"haConfig":[{"property":"name","value":""},{"property":"icon","value":""}],"x":180,"y":460,"wires":[["eba7a53b.aa0528"]]}]
```
    

To use this in your setup, change the first node to an event name you like to listen to, the second node to the sensor you want to use and maybe alter *Prepare search* if your sensor has different attributes than mine. You have to enter your playlist id in the *Prepare track addition* node.

Now, I can trigger the event `nodered:dlftospotify` to save the current song to my playlist!

![My home screen widget to easily save the current song](../../assets/spotify-widget.jpg)

I call this event from a script in Home Assistant to make it easier to call and also created a widget on my phone to call that service using the [Home Assistant Companion for Android](https://companion.home-assistant.io/). In the future, I might add an Alexa routine to be able to say something like "Alexa, save the current song". If you listen to multiple stations, it might be cool to differentiate which one you listen to based on a media_player entity and then save the song from the currently playing station to your playlist.
