---
layout: docs
title: Using Augments
prev_section: custom-events
next_section: integrations
permalink: /docs/using-augments/
---

The purpose of **augments** are to allow you to add additional data to events
that may be necessary in the context of matching a pattern or sending a
notification but was not available at the time the event was sent to CxEngage.

## Augment Types

### Engine Augment

The purpose of an **engine augment** is to augment an event before it is
received by the pattern matching engine. In most cases, this means applying
additional data to an event that is necessary for a pattern match but was not
included when the event was sent to CxEngage.

For example, if you had a customer id and wanted the customer's segment as part
of a pattern match, you could augment the customer's segment using an **engine
augment** before it was to be processed.

### Notification Augment

The purpose of a **notification augment** is to augment a reaction context (a
merger of all events for a given reaction) once the pattern has been matched. In
most cases, this means applying additional data that is necessary for the
reaction to take place but was not necessary for the pattern match.

For example, if you had a customer id and wanted to send a phone call, you could augment the
users phone number using a **notification augment** before it is to be sent.

## Augment Methods

### File Upload

CxEngage supports uploading of `.csv` files that can augment data into your
events. The **first column** of the `.csv` file will be used to map other attributes which
follow into the event.

<pre>
id,twitter,github
2000,ianbishop,ianbishop
</pre>

Given the above `.csv` file, augmenting would occur based off the `id` field in
the event and would insert those attributes and their values into the event.

#### Simple Augment

Using the above `.csv` file, if we sent in the event:

{% highlight javascript %}
{
  "id": 2000,
  "name": "Ian Bishop"
}
{% endhighlight %}

Then the event would be augmented as follows:

{% highlight javascript %}
{
  "id": 2000,
  "name": "Ian Bishop",
  "twitter": "ianbishop",
  "github": "ianbishop"
}
{% endhighlight %}

#### Overriding Attributes

You can also use the augment service to override values in the event.

Given the `.csv`:

<pre>
username,username
ian,not-ian
</pre>

Sending the event:

{% highlight javascript %}
{
  "username": "ian"
}
{% endhighlight %}

Would be augmented as follows:

{% highlight javascript %}
{
  "username": "not-ian"
}
{% endhighlight %}

### API

#### Attributes
