---
layout: docs
title: Using Listeners
prev_section: using-endpoints
permalink: /4.1/docs/using-listeners/
version: 4.1
categories: ['docs']
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
Base](https://cxengage.zendesk.com/hc/en-us/sections/200181877-Listeners).


## Listener Connection Status

If you would like to get the status of your listener connection, you can use the following call

{% highlight bash %}
curl -XGET https://api.cxengage.net/1.0/tenants/TENANT-NAME/listeners/LI1/status \
     -H 'Authorization: Bearer TOKEN'
{% endhighlight %}

{% highlight javascript %}
{
  "id":"status",
  "status":"started",
  "message":"Connected to stream: hash-id"
}
{% endhighlight %}

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

If you were sending in existing events which looked like this:

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

In the UI, it would look like this

![Set up your listener mappings]({{ site.url }}/img/using-listeners/listener_mappings.png)
                                        
