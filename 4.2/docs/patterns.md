---
layout: docs
title: Patterns
prev_section: key-attribute
next_section: templates
permalink: /4.2/docs/patterns/
version: 4.2
categories: ['docs']
---

A *pattern* describes a series of events that make up a customer's journey as
they interact with your company across channels. As a user of CxEngage, you
write patterns that match journeys which are important to your organization.

A pattern typically looks for an event in the beginning and then you can decide what you would like to occur as a result. For example, here is a pattern for where a customer calls in, has their issue handled, but realizes that they forgot something and calls back. We want to connect them to the same agent. The pattern would look like this:

{% highlight clojure %} 
(within 1 day
  (sequence
    (event {:status "call-started"})
    (event {:status "call-ended"})
    (event {:status "call-started"})))

(if-let [rep (fetch liveops agent {:attributes {:id $rep-id}}
                    (timeout 1 minute))]
  (perform liveops connect {:rep-id $rep-id})
  (if-let [rep (fetch liveops agent {:attributes {...}})]
    (perform liveops connect {:rep-id rep.id})))
{% endhighlight %}

The details of how this pattern works may not be clear just yet, but we'll go into the specifics shortly. This pattern is relatively complex but shows the flexibility and the power of the platform.
