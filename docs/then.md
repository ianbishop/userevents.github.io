---
layout: docs
title: Thens
prev_section: when
next_section: using-templates
permalink: /docs/then/
---

## Keywords

The following keywords are available to describe the __then__ of a pattern:

<table class="pure-table">
  <tbody>
    <tr>
      <td>par</td>
      <td>if</td>
      <td>success</td>
      <td>delay</td>
      <td>set</td>
    </tr>
    <tr>
      <td>seq</td>
      <td>send</td>
      <td>failure</td>
      <td>timeout</td>
      <td>template</td>
    </tr>
  </tbody>
</table>

## Simple Thens

A very simple __then__ is to send a call with Twilio to a customer.

{% highlight clojure %}
(send twilio call {:to-phone-number *phone-number*})
{% endhighlight %}

Let's go through the expression above:

1. The `send` keyword means to send a notification
2. `twilio` is the type of endpoint we'd like to use
3. `call` is the verb of twilio we're using. Each endpoint has at least one verb.
4. Finally, we have a map that includes a `:to-phone-number`. This is the phone
   number we'd like Twilio to call.
5. `*phone-number*` is special markup that allows us to use the "phone-number"
   field from the event

Now, let's say we'd first like to send an SMS to a customer that we're going to
be calling them shortly.

We can use the `seq` keyword, which sends notifications sequentially.

{% highlight clojure %}
(seq
  (send twilio sms {:to-phone-number *phone-number*
                    :message "We appologize for the long waits,
                              an agent will call you back shortly"})
  (send twilio call {:to-phone-number *phone-number*}))
{% endhighlight %}

By using the `seq` keyword, we know that the SMS will go out before the agent
calls. What's important to note is that, if the SMS fails to send, then the
phone call will not be made.

## Execution Blocks

Reactions are formed from two primitive building blocks: **par** and **seq**.
These two keywords describe the method in which their children should be evaluated.
Both of the execution blocks can be nested within one another.

### par

{% highlight clojure %}
; Syntax
(par <members> <options>)

; Send three messages to echo in parallel
(par
  (send echo message {:message "Hello World1"})
  (send echo message {:message "Hello World2"})
  (send echo message {:message "Hello World3"}))
{% endhighlight %}

**par** blocks will evaluate in parallel. One must be conscious of the repercussions of evaluating their blocks in parallel. Results will be returned in a non-deterministic manner, thus all members of the parallel block should be independent of one another. Also to note is that if one member of the block fails, the entire block fails. If a retry is defined, the entire block will be resent regardless of existing in-flight invocations.

### seq

{% highlight clojure %}
; Syntax
(seq <members> <options>)

; Send one message to echo, delay one minute, then send another message to echo
(seq
  (send echo message {:message "Hello World1"})
  (delay 1 minutes)
  (send echo message {:message "Hello World2"}))
{% endhighlight %}

**seq** blocks will be evaluated sequentially. As the sequential block is executed in a deterministic manner, it is safe to create dependencies between elements (in a sequential manner). As with the parallel block, the block will fail if the current member fails. On failure, if a retry is defined, the sequential block will restart from its first member.

## Variables

**Thens** support a simple form of variables and assignment. All variables defined in
a reaction are global in scope. This means they can be accessed by any member of the reaction after
definition.

Values can come from one of four sources:
* Reaction Context (a merger of all events, by precedence of time received)
* Endpoint Response
* Reaction Variable
* Constant

Value access of the above types is done as follows:

{% highlight clojure %}
; Access the value custId, in the canonical event record
*custId*

; Access the value call-id, in an endpoint response
$call-id

; Access the value success-call, in the reaction
success-call

; Use a constant value.
; Constants can be strings, boolean, or numbers
"gold"
42
false
{% endhighlight %}

User defined variables can be created using the **set** command, which can be nested within execution blocks.

{% highlight clojure %}
; Create a variable message-sent, using the call-id value from an endpoint response
(set message-sent $call-id)

; Create a variable cust-seg, using a constant
(set cust-seg "gold")

; Create a variable id, using the custId value in the reaction context
(set id *custId*)
{% endhighlight %}

## Actions


