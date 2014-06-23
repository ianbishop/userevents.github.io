---
layout: docs
title: Key Attribute
next_section: patterns
permalink: /4.2/docs/key-attribute/
version: 4.2
categories: ['docs']
---

The *key attribute* is the unique identifier for your events that identifies a specific individual. Often, it will be something like a unique customer identifier such as a customer number or a username.

What's important to note is that there is only one key attribute per pattern. All other attributes are mapped upon it, either by being submitted in the event or later augmented by the Augment service. This builds a profile of all the possible identifiers for that one individual.

For instance, a key attribute could be "1234". If an event later comes in
with that key attribute and the user's email address, that email address will be
mapped to "1234" and both will identify the same person.

## Example

Let's say we had a pattern that would match when a call gets abandoned from an
IVR, and as a result, we trigger an outbound call using our integration with Twilio. If some of this code doesn't look familiar, that's ok - it will be explained shortly in the next sections. 

{% highlight clojure %}
(event {:type "CallAbandoned"})
(create twilio call {:to $Phone-Number
                     :from "15068009013"
                     :url "http://twimlets.com/echo"
                     :Twiml (template +TM1)})
{% endhighlight %}

If the key attribute were `user`, the following event would match the pattern
and send them a phone call.

{% highlight javascript %}
{
  "user": "1234",
  "callAction": "AbandonedCall",
  "phone-number": "+19995554545"
}
{% endhighlight %}
