---
layout: docs
title: Using Augments
prev_section: custom-events
next_section: integrations
version: 4.2
permalink: /4.2/docs/using-augments/
categories: ['docs']
---

The purpose of **augments** are to allow you to add additional data to events
that may be necessary in the context of matching a pattern or sending a
notification but was not available at the time the event was sent to CxEngage.

## Augment

The purpose of an **augment** is to augment an event before it is
received by the pattern matching engine. In most cases, this means applying
additional data to an event or modifying existing attributes that is necessary
for a pattern match but was not included when the event was sent to CxEngage.

For example, if you had a customer id and wanted the customer's segment as part
of a pattern match, you could augment the customer's segment using an **engine
augment** before it was to be processed.

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

### CxEngage Augment API Service

In addition to the **file augment** type, we provide an **API Augment**
mechanism to reach out to 3rd party REST services for augmenting data.

#### API Augment Behaviour

The Augment service will POST a JSON object that contains the following
elements: `key-attr` and `attributes`.

* The POST will be of `Content-Type`: `application/json`
* The `key-attr` is the value of the event's key attribute.
* The `attributes` is the values of the event's attributes represented as a map.
* The resulting augmented values will be cached for a configurable amount of time by key
  attribute.

Here is an example of an event with a key attribute: "1234" and an event
attribute `name` with the value of "John Smith".

{% highlight javascript %}
{
  "key-attr" : "1234",
  "attributes" : {"id":"1234",
                  "name":"John Smith"}
}
{% endhighlight %}

The 3rd party Augment REST API may modify any existing attribute -- if modified,
that attribute will override it's previous value. The API may also augment
additional attributes onto the event. These new attribute will be merged into
the event.

#### Implementation

A 3rd party augment provider must implement the following:

* The URL endpoint MUST accept: `application\json`
* Upon successfully augmenting the event, the augment provider MUST return
  `status code`: 200, with `Content-Type`: `application\json`
* The response body MUST be a JSON object in the same format as described in
  `API Augment Behaviour`
