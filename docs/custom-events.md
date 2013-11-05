---
layout: docs
title: Submitting Custom Events
prev_section: integrate
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

Events are submitted as `JSON` and must contain the [key attribute]() of your
tenant.

In order to submit events, you must also be authenticated. Please read the [Authentication documentation]() for more details.

{% highlight bash %}
curl -iX POST https://events.cxengage.net/1.0/tenants/TENANT-NAME/event \
     -H 'Authorization: Bearer TOKEN' \
     -H 'Content-Type: application/json' \
     -d '{"key" : "1", "type" : "bar"}'
{% endhighlight %}

### Result

{% highlight javascript %}

{% endhighlight %}

### Timeouts

In the event that the system is under heavy-load or something bad has happened, it is possible that you may receive a response of `403` and the following error:

{% highlight javascript %}
{
  "error": "Timeout ocurred"
}
{% endhighlight %}

In the event that you encounter such a message, please [contact support]() and
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
