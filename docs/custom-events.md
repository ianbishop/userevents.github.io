---
layout: docs
title: Submitting Custom Events
prev_section: authentication
next_section: using-augments
permalink: /docs/custom-events/
---

Custom events allow you to use CxEngage to react based upon your own data.
Patterns can be written to allow you to quickly sift through your systems data
and make engagements instantly.

## Versioning

The current version of the REST Receiver is `1.0`.

`https://events.cxengage.net/version`


## Submitting an Event

Events are submitted as `JSON` and must contain the <a href="{{site.url}}/docs/key-attribute">key attribute</a> of your tenant.

In order to submit events, you must also be authenticated. Please read the <a href="{{site.url}}/docs/authentication">Authentication documentation</a> for more details.

{% highlight bash %}
curl -iX POST https://events.cxengage.net/1.0/tenants/TENANT-NAME/event \
     -H 'Authorization: Bearer TOKEN' \
     -H 'Content-Type: application/json' \
     -d '{"key" : "1", "type" : "bar"}'
{% endhighlight %}

### Result

{% highlight javascript %}
{
  "event": {
    "type": "bar",
      "key": "1"
  },
  "key-attr": "1",
  "id": "EV11-30168",
  "contributing?": true
}
{% endhighlight %}

* `event` represents the original event
* `key-attr` is the value of the key attribute from this event
* `id` is a unique identifier for this event
* `contributing?` represents if the event contributed to a pattern match

## Event History

You can retrieve the last 10 events that was sent to the REST receiver. 

{% highlight bash %}
curl -XGET https://events.cxengage.net/1.0/tenants/userevents/event/history \     
     -H 'Authorization: Bearer TOKEN'
{% endhighlight %}

### Result

{% highlight javascript %}
{
  "history":
  {"event": {
      "network":"twitter",
      "followers":558,
      "sentiment":0,"user":"suhaim_a"},
      "key-attr":"suhaim_a",
      "id":"EV11-65343",
      "return-address":"SV11.",
      "contributing":true}
{% endhighlight %}


### Timeouts

In the event that the system is under heavy-load or something bad has happened, it is possible that you may receive a response of `403` and the following error:

{% highlight javascript %}
{
  "error": "Timeout ocurred"
}
{% endhighlight %}

In the event that you encounter such a message, please [contact
support](http://support.cxengage.com) and
we will investigate immediately (if we aren't already on the case!).

### Rate Limiting

By default, tenants are rate limited in the number of events they can submit.
For 30-day trial users, this limit is 100 events/second. Please consult your
plan for more information.

If you exceed your rate limit, your request will respond with a response code of `429`.

{% highlight javascript %}
{
  "error": "Exceeded rate limit"
}
{% endhighlight %}
