---
layout: docs
title: Quickstart
prev_section: home
permalink: /4.2/docs/quickstart/
version: 4.2
categories: ['docs']
---

In this quickstart guide, we're going to go through a "Hello World" of the
CxEngage system. By the end of this guide, you will have a better understanding
of the basics of how CxEngage works.

In this example, we will configure a simple pattern and submit events which will
result in a pattern match.

## Key Attribute

First, we must setup our key attribute. The key attribute is the main attribute
we will use to segment events in the system. Key attributes are set per pattern.
For instance, your key attribute may be something like a customer id for PT1 and username for PT2

You can set your key attribute through our web application by visiting the Tenant
configuration page.

In our example, we will be setting our key attribute to be `id` for a pattern.

## Creating your First Pattern

Patterns are the building blocks of your CxEngage system. With them, you describe how the system should understand your data and what to do when it detects that a pattern match has occurred.

Patterns are described using the CxEngage DSL, which typically starts with an event keyword. 

For this example, we will be matching an event where the value of `type` is equal to `test`. Then we will use the echo endpoint to echo out "Hello World!"

Head over to the Patterns tab, click New and begin creating your new pattern. 


* __Name__: The name for your pattern (e.g. My First Pattern)
* __Description__ *(optional)*: A short description of your pattern (e.g. CxEngage
Quickstart)
* __Key Attribute__ : As discussed above, set up a key attribute that you want for your pattern

Now that our pattern has been created, we can begin flushing out how it should
work.

### Pattern

**We want our pattern to match any time that `type` is equal to "hello", so we put this as the event. We would like our pattern to echo "Hello World" when this event is received by CxEngage. The pattern would be written in the following way.** 

**{% highlight clojure %}**
**(event {:type "hello"})**
**(perform echo message {:message "Hello World!"})**
**{% endhighlight %}**

![Configure your pattern]({{ site.url }}/img/quickstart/KeyAttributePattern.png)

## Enabling

Be sure to check the "Enabled?" checkbox. By default, all new patterns are disabled, meaning they won't be actively searching for pattern matches.

Once you're done, hit the "Save" button.

## Submitting an Event

### Authenticating

CxEngage uses OAuth 2.0 to ensure that you can securely send events to our APIs.

In order to be able to submit an event, you must first get your `client id` and `client secret`. You can find these by clicking on your Gravatar (the image on the left navigation menu). There you will also find your `tenant`, which is required to send events to the right place.

### Using the Demo Event Submitter

There are number of ways to send events to CxEngage. To make things easier,
we've made a [simple event generator](https://demo.cxengage.net) you can use - simply enter your information from the instructions above.

### Matching Our Pattern

For our pattern to match, we need to submit an event that meets two conditions: 1) it must have our key attribute -- `id`, and 2) we need it to match our event. In the pattern we created, we checked to see that the event `type` was equal to "hello", so let's send an event that has that by putting the following as the Event JSON in the event generator:

{% highlight javascript %}
{
  "id": "1234",
  "type": "hello"
}
{% endhighlight %}

![Using the event generator]({{ site.url }}/img/quickstart/Generator.png)

### Sending the Event

Hit the "Send Event" button! You should see that your event was successfully received.

If you don't get a success message, one of the following may be the cause:

* The key attribute value sent does not match any of the patterns
* The message was incorrectly formatted (i.e. you submitted invalid JSON)
* Your credentials were incorrect (make sure you have them in the right order)

## Confirming Pattern Match

Since we only used echo for testing reasons, there won't be any phones ringing or emails being received to let you know it worked. Instead, log into the CxEngage web application and head over to the "Search" tab.

Try searching for the key attribute "1234" from above. You should see your event, its notification and all the information to go along with it in the results.

![Search for your event]({{ site.url }}/img/quickstart/Search4_2.png)

## What's Next

This example provided you with a chance to get a better understanding of
CxEngage and see it work from end-to-end. Now you can begin creating more complex patterns, using the augment service to add additional attributes to events and connect CxEngage with your third-party systems like Salesforce.com, DataSift, Twilio or SendGrid.

Next we're going to cover some of the key concepts of CxEngage, giving you a
better chance to see how you can be creative with the system.
