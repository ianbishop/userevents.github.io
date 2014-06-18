---
layout: docs
title: Whens
prev_section: key-attribute
next_section: then
permalink: /4.1/docs/when/
version: 4.1
categories: ['docs']
---

## Keywords

The following keywords are available to describe the __when__ of a pattern:

<table class="pure-table">
  <tbody>
    <tr>
      <td>=</td>
      <td>not</td>
      <td>within</td>
      <td>any</td>
      <td>seconds</td>
    </tr>
    <tr>
      <td>&gt;</td>
      <td>and</td>
      <td>seq</td>
      <td>count</td>
      <td>minutes</td>
    </tr>
    <tr>
      <td>&lt;</td>
      <td>or</td>
      <td>all</td>
      <td>fail</td>
      <td>hours</td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td></td>
      <td>contains</td>
      <td>days</td>
    </tr>
  </tbody>
</table>

## Simple Whens

Let's start with trying to write a simple expression. A very simple test pattern
we use a lot is one where `customerSegment` is "platinum".

{% highlight clojure %}
(event (= customerSegment "platinum"))
{% endhighlight %}

Let's go through the expression above.

1. The `event` keyword simply refers to the event
2. `=` checks for equivalence
3. `customerSegment` is the name of the attribute we're checking
4. "platinum" is the value we're looking to check for equivalence

Now, let's say we wanted the pattern to match for anyone with Customer Segment
Platinum and a failed check-in.

We can write this pattern much like the previous one, simply adding one more
event to the list.

{% highlight clojure %}
(event (and (= customerSegment "platinum")
            (= type "flcheck")))
{% endhighlight %}

As you can see, we used the `and` keywords to accomplish this.

Here is a list of logical operators like `and` that you can use in your when expressions:

<table class="pure-table">
  <tbody>
    <tr>
      <td>=</td>
      <td>&gt;</td>
      <td>&lt;</td>
      <td>not</td>
      <td>and</td>
      <td>or</td>
    </tr>
  </tbody>
</table>

## Counting Events

Let's say we wanted our pattern to match if two events happened. For example, we
want our pattern to match if a person with Customer Segment Platinum fails to
check-in twice.

To do this, we can use the `count` keyword.

{% highlight clojure %}
(count 2 (event (and (= customerSegment "platinum")
                     (= type "flcheck"))))
{% endhighlight %}

Other options similar to `count` available are:

<table class="pure-table">
  <tbody>
    <tr>
      <td>within</td>
      <td>Within some duration</td>
    </tr>
      <td>seq</td>
      <td>In this sequence</td>
    </tr>
      <td>all</td>
      <td>All of these things</td>
    </tr>
      <td>any</td>
      <td>Any of these things</td>
    </tr>
      <td>count</td>
      <td>This many things</td>
    </tr>
      <td>fail</td>
      <td>Fail if this happens</td>
    </tr>
  </tbody>
</table>

## Multiple Conditions

Now, if we want to add another event type to our patterns, for example, we want
the pattern to match when there is 2 failed check-ins and 1 cancelled ticket.

We can use the `all` keyword to accomplish this:

{% highlight clojure %}
(all (count 2 (event (and (= customerSegment "platinum")
                          (= type "flcheck"))))
     (count 1 (event (and (= customerSegment "platinum")
                          (= type "cnclticket")))))
{% endhighlight %}

## Including Time

Of course, it's often difficult to write useful patterns that aren't sensitive
to time. Let's say we want to know if the user has had this happen within the
last hour.

{% highlight clojure %}
(within 1 hours
        (all (count 2 (event (and (= customerSegment "platinum")
                                  (= type "flcheck"))))
             (count 1 (event (and (= customerSegment "platinum")
                                  (= type "cnclticket"))))))
{% endhighlight %}

To do this, we used the `within` keyword and one of the duration keywords --
`hours`.

Here are all the other durations available:

<table class="pure-table">
  <tbody>
    <tr>
      <td>seconds</td>
      <td>minutes</td>
      <td>hours</td>
      <td>days</td>
    </tr>
  </tbody>
</table>

## Ordering

Let's say we wanted our pattern to only trigger if a customer received a failed
check-in and then cancel ticket.

The previous patterns would match if the ticket had been canceled first, then
failed check-in occurs.

To ensure ordering, we can use the `seq` keyword:

{% highlight clojure %}
(all (seq (event (= type "cnclticket"))
          (event (= type "flcheck"))))
{% endhighlight %}

That concludes the most frequently used keywords in the CxEngage DSL for
__whens__. Next, we will explore the potential of the __then__ language.

