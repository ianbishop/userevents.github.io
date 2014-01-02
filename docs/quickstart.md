---
layout: docs
title: Quickstart
prev_section: home
permalink: /docs/quickstart/
categories: ['docs']
---

In this quickstart guide, we're going to go through a "Hello World" of the
CxEngage system. By the end of this guide, you will have a better understanding
of the basics of how CxEngage works.

In this example, we will configure a simple pattern and submit events which will
result in a pattern match.

## Key Attribute

First, we must setup our key attribute. The key attribute is the main attribute
we will use to segment events in the system. For instance, your key attribute
may be something like a unique customer id.

You can set your key attribute through our web application by visiting the Tenant
configuration page.

In our example, we will be setting our key attribute to be `id`.

![Set your key attribute]({{ site.url }}/img/quickstart/KeyAttribute.png )

## Creating your First Pattern

Patterns are the building blocks of your CxEngage system. With them, you describe how the system should understand your data and what to do when it detects that a pattern match has occurred.

Patterns are described using the CxEngage DSL, which is comprised of two parts: a "when", which describes what pattern you're looking for, and a "then", which describes what to do when you find it.

For this example, we will be matching an event where the value of `type` is equal to `test`. Then we will be sending a notification using the Echo
endpoint, which is a test endpoint provided with CxEngage.

Head over to the Patterns tab, click New and begin creating your new pattern.

* __Name__: The name for your pattern (e.g. My First Pattern)
* __Description__ *(optional)*: A short description of your pattern (e.g. CxEngage
Quickstart)

Now that our pattern has been created, we can begin flushing out how it should
work.

### When

We want our pattern to match any time that `type` is equal to "test", so we put this in the "when" part of the pattern:

{% highlight clojure %}
(event (= type "test"))
{% endhighlight %}

### Then

We want our reaction to create a notification to the test endpoint, Echo:

{% highlight clojure %}
(send echo message {:message "Hello World!"})
{% endhighlight %}

## Enabling

Be sure to check the "Enabled?" checkbox. By default, all new patterns are disabled, meaning they won't be actively searching for pattern matches.

Once you're done, hit the "Save" button.

![Setting up your pattern using Echo]({{ site.url }}/img/quickstart/EchoTest.png)

## Submitting an Event

### Authenticating

CxEngage uses OAuth 2.0 to ensure that you can securely send events to our APIs.

In order to be able to submit an event, you must first get your `client id` and `client secret`. You can find these by clicking on your Gravatar (the image on the left navigation menu). There you will also find your `tenant`, which is required to send events to the right place.

### Using the Demo Event Submitter

There are number of ways to send events to CxEngage. To make things easier,
we've made a [simple event generator](https://demo.cxengage.net) you can use - simply enter your information from the instructions above.

### Matching Our Pattern

For our pattern to match, we need to submit an event that meets two conditions: 1) it must have our key attribute -- `id`, and 2) we need it to match the "when" of our pattern. In the pattern we created, we checked to see that the event `type` was equal to "test", so let's send an event that has that by putting the following as the Event JSON in the event generator:

{% highlight javascript %}
{
  "id": "1234",
  "type": "test"
}
{% endhighlight %}

![Using the event generator]({{ site.url }}/img/quickstart/Generator.png)

### Sending the Event

Hit the "Send Event" button! You should see that your event was successfully received.

If you don't get a success message, one of the following may be the cause:

* The key attribute value sent does not match the one you setup
* The message was incorrectly formatted (i.e. you submitted invalid JSON)
* Your credentials were incorrect (make sure you have them in the right order)

## Confirming Pattern Match

Since we only sent a test notification, there won't be any phones ringing or emails being received to let you know it worked. Instead, log into the CxEngage web application and head over to the "Search" tab.

Try searching for the key attribute "1234" from above. You should see your event, its notification and all the information to go along with it in the results.

![Search for your event]({{ site.url }}/img/quickstart/Search.png)

## What's Next

This example provided you with a chance to get a better understanding of
CxEngage and see it work from end-to-end. Now you can begin creating more complex patterns, using the augment service to add additional attributes to events and connect CxEngage with your third-party systems like Salesforce.com, DataSift, Twilio or SendGrid.

Next we're going to cover some of the key concepts of CxEngage, giving you a
better chance to see how you can be creative with the system.
