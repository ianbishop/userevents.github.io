---
layout: docs
title: Using Listeners
prev_section: using-endpoints
permalink: /docs/using-listeners/
---

**Listeners** allow you to forward events from an existing third-party service
into CxEngage. Listeners work by mapping values from the third-party event into
your event (including the key attribute).

Currently, the following **listeners** are available:

* DataSift
* Salesforce
* Pusher

## What to listen to

You will need to supply an extra parameter which denotes what to listen to. In
the case of DataSift, for example, you must provide the **Stream Hash**. This
let's CxEngage know exactly which stream it should be listening for events from.

For more information on listener parameters, visit the [Knowledge
Base](http://support.cxengage.com).

## Mapping Attributes

In order to make third-party events be understood by CxEngage, you must first
map attributes from the third-party event to a CxEngage event. This is especially true for the key attribute, which is required for every
event.

In order to map embedded keys, you can abbreviate them with `.` syntax.

For example,

{% highlight javascript %}
{
  "interaction": {
    "author": {
      "username": "ianbishop"
    }
  }
}
{% endhighlight %}

becomes

{% highlight javascript %}
"interaction.author.username"
{% endhighlight %}

### Example

If you were sending in exisiting events which looked like this:

{% highlight javascript %}
{
  "name": "Ian Bishop",
  "type": "web",
  "username": "ianbishop"
}
{% endhighlight %}

And you wanted to add a DataSift listener which listened for tweets, your
mapping might look something like:

{% highlight javascript %}
{
  "interaction.author.name": "name",
  "interaction.type": "type",
  "interaction.author.username": "username"
}
{% endhighlight %}
