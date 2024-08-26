## LANsaver

LANsaver is a nextjs application that allows people to configure Devices on their network that they wish to back up configurations for - Firewalls, Managed Switches, Home Assistant instances, etc.

It is integrated with [InformAI](https://github.com/edspencer/inform-ai), and acts as an example of how to do that ([see the announcement blog post for more](https://edspencer.net/2024/8/26/introducing-inform-ai)).

There is a live demo of LANsaver running at https://lansaver.edspencer.net. This live demo is pointed at a [test harness](https://github.com/edspencer/lansaver-test-harness) that just mocks out some fake devices.

LANsaver is intended to be run locally on your network, and to push its backups to some offsite destination like a GitHub repository. I have it running on [TrueNAS Scale](https://www.truenas.com/truenas-scale/), where it is continually backing up my [OPNsense firewall](https://opnsense.org/), [TPLink managed switches](https://amzn.to/3T0ZqmY) and [Home Assistant](https://www.home-assistant.io/) instance.

LANsaver uses React Server Components and Vercel AI SDK in addition to InformAI.

## Supported Backup Sources

- OPNSense
- Home Assistant
- TP Link Managed Switches
- LANsaver itself

## Supported Destinations

- git repository
