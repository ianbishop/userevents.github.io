---
layout: docs
title: Key Attribute
next_section: patterns
permalink: /docs/key-attribute/
---

The *key attribute* is the unique identifier for your events. It's used to
segment events against a given pattern. Often, it will be something like a unique
customer identifier such as a customer number or a username.

What's important to note is that there is only one key attribute and it's the only attribute required in an event. All other attributes are mapped upon it, either by being submitted
in the event or later augmented by the Augment service.

For instance, if a key attribute could be "1234". If an event later comes in
with that key attribute and the user's email address, that email address will be
mapped to "1234" and can later be used in notifying the user.

## Example

Let's say we had a pattern that would match when a call gets abandoned from an
IVR and an agent calls the customer back, using our integration with Twilio.

### When
{% highlight clojure %}
(event (= callAction "AbandonedCall"))
{% endhighlight %}

### Then
{% highlight clojure %}
(send twilio call {:to-phone-number *phone-number*})
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
