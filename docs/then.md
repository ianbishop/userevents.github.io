---
layout: docs
title: Thens
prev_section: when
permalink: /docs/then/
categories: ['docs']
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

Reactions are formed from two primitive building blocks: `par` and `seq`.
These two keywords describe the method in which their children should be evaluated.
Both of the execution blocks can be nested within one another.

### par

{% highlight clojure %}
(par <members> <options>)
{% endhighlight %}

`par` blocks will evaluate in parallel. One must be conscious of the repercussions of evaluating their blocks in parallel. Results will be returned in a non-deterministic manner, thus all members of the parallel block should be independent of one another. Also to note is that if one member of the block fails, the entire block fails. If a retry is defined, the entire block will be resent regardless of existing in-flight invocations.

#### Send three messages to echo in parallel
{% highlight clojure %}
(par
  (send echo message {:message "Hello World1"})
  (send echo message {:message "Hello World2"})
  (send echo message {:message "Hello World3"}))
{% endhighlight %}

### seq

{% highlight clojure %}
(seq <members> <options>)
{% endhighlight %}

`seq` blocks will be evaluated sequentially. As the sequential block is executed in a deterministic manner, it is safe to create dependencies between elements (in a sequential manner). As with the parallel block, the block will fail if the current member fails. On failure, if a retry is defined, the sequential block will restart from its first member.

#### Send one message to echo, delay one minute, then send another message to echo
{% highlight clojure %}
(seq
  (send echo message {:message "Hello World1"})
  (delay 1 minutes)
  (send echo message {:message "Hello World2"}))
{% endhighlight %}

## Variables

__Thens__ support a simple form of variables and assignment. All variables defined in
a reaction are global in scope. This means they can be accessed by any member of the reaction after
definition.

Values can come from one of four sources:

* Reaction Context (a merger of all events, by precedence of time received)
* Endpoint Response
* Reaction Variable
* Constant

#### Access the value custId, in the reaction context
{% highlight clojure %}
*custId*
{% endhighlight %}

#### Access the value call-id, in an endpoint response
{% highlight clojure %}
$call-id
{% endhighlight %}

#### Access the value success-call, in the reaction
{% highlight clojure %}
success-call
{% endhighlight %}

####  Constants can be strings, boolean, or numbers
{% highlight clojure %}
"gold"
42
false
{% endhighlight %}

### set

{% highlight clojure %}
(seq <name> <value>)
{% endhighlight %}

User defined variables can be created using the `set` command, which can be nested within execution blocks.

#### Create a variable cust-seg using a constant
{% highlight clojure %}
(set cust-seg "gold")
{% endhighlight %}

#### Create a variable id using `custId` from the reaction context
{% highlight clojure %}
(set id *custId*)
{% endhighlight %}

#### Create a variable message-sent using `call-id` from a notification response
{% highlight clojure %}
(set message-sent $call-id)
{% endhighlight %}

## Actions

### send

{% highlight clojure %}
(send <endpoint> <type> {<params>} <options>)
{% endhighlight %}

The `send` command is used to send notifications to specific endpoints. The endpoint, type, and params are mandatory fields. Additional options will are outlined in the options section. The params must include all mandatory fields outlined in the definition of the endpoint. A single send may be used outside of an execution block. This can be useful when using the `if` command.

#### Sending an Echo notification with the message "Hello World"
{% highlight clojure %}
(send echo message {:message "Hello World"})
{% endhighlight %}

#### Sending an SMS with Twilio
{% highlight clojure %}
(send twilio sms {:to-phone-number *phone-number*
                  :from-phone-number "1-506-555-1234"
                  :message sms-message})
{% endhighlight %}

* `:to-phone-number` from reaction context
* `:from-phone-number` as a constant
* `:message` from a user variable


### delay

{% highlight clojure %}
(delay <duration> <unit>)
{% endhighlight %}

The `delay` command will delay further evaluation of a reaction. This delay respects the execution block in which it is evaluated. In a sequential block, it will block further evaluation until the delay expires. In a parallel execution block the delay is evaluated in parallel to the other members of the block, thus causing the delay to act as a *minimum evaluation time* command rather than a strict delay.

#### Durations

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

#### Create a delay of five minutes
{% highlight clojure %}
(delay 5 minutes)
{% endhighlight %}

#### Create a delay of 30 seconds
{% highlight clojure %}
(delay 30 seconds)
{% endhighlight %}

### await

The `await` command is used to perform asynchronous communication with an endpoint. In truth, `await` is syntactic sugar to perform a poll against a command in an endpoint. The body of the `await` must consist of an `if` statement, whose predicate represents what you are waiting for. The `success` and `failure` within the `if` will be executed based on the final outcome of the await. A `within` option must also be present to denote the total time the poll should last. The poll cycle will wait one second between polls.

#### Await a twilio call to be answered within 10 minutes
{% highlight clojure %}
(seq
  (await twilio call-status {:sid 12345}
    (if (= "answered" $call-status)
        (success (set msg "The call was answered"))
        (failure (set msg "No one was there")))
    (within 10 minutes))
  (send twilio sms {:message msg ...}))
{% endhighlight %}

### if

{% highlight clojure %}
(if <predicate> (success <then>) (failure <else>))
{% endhighlight %}

The `then` and `else` elements can be either an execution block or a single command.

#### Predicates

<table class="pure-table">
  <tbody>
    <tr>
      <td>=</td>
      <td>&gt;</td>
      <td>&lt;</td>
      <td>not</td>
      <td>and</td>
      <td>or</td>
      <td>any value</td>
    </tr>
  </tbody>
</table>

#### If the cust-seg event record value is "gold" then send message-one to echo otherwise send message-two
{% highlight clojure %}
(if (= *cust-seg* "gold")
  (success (send echo message {:message message-one}))
  (failure (send echo message {:message message-two})))
{% endhighlight %}


### Predicates

#### Logical And
{% highlight clojure %}
(and <predicate> <predicate>)
{% endhighlight %}

#### Logical Or
{% highlight clojure %}
(or <predicate> <predicate>)
{% endhighlight %}

#### Logical Not
{% highlight clojure %}
(not <predicate>)
{% endhighlight %}

#### Equivalence
{% highlight clojure %}
(= <predicate> <predicate>)
{% endhighlight %}

#### Greater Than
{% highlight clojure %}
(> <predicate> <predicate>)
{% endhighlight %}

#### Less Than
{% highlight clojure %}
(< <predicate> <predicate>)
{% endhighlight %}

#### Value (of any type)
{% highlight clojure %}
*id*
42
"Hello World"
{% endhighlight %}

## Options

The following options can be applied to `seq`, `par`, `send`, and `await` commands

### retries

{% highlight clojure %}
(retries <count>)
{% endhighlight %}

If a command has a defined retry option, when the command fails, it will be retried. A command will only be treated as *failed* when all of its retries have been exhausted.

#### Send a message to echo with 2 retries
{% highlight clojure %}
(send echo message {:message "Hello World"}
  (retries 2))
{% endhighlight %}

### within

{% highlight clojure %}
(within <duration> <unit>)
{% endhighlight %}

When a command is evaluated which has a defined timeout, if it does not complete within the defined duration, the event will be failed. Retries will be respected by timeouts, if the timeout occurs, and retries remain, the command will be retried.

#### Durations

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

#### Send three messages to echo in parallel with a five second timeout
{% highlight clojure %}
(par
  (send echo message {:message "Hello World"})
  (send echo message {:message "Hello World"})
  (send echo message {:message "Hello World"})
  (within 5 seconds))
{% endhighlight %}

### template

{% highlight clojure %}
(template {<params>})
{% endhighlight %}

Parameters defined using the `template` option will be sent to the endpoint as the rendered version of the provided template. The template will have access to the reaction context when being rendered. The value for the template can be any of the value types. Parameters which are to be templated, do not need to be defined in the main send parameter definition.


#### Use a message template when sending an SMS to Twilio
{% highlight clojure %}
(send twilio sms {:to-phone-number *phone-number*
                  :from-phone-number "1-506-555-1234"}
  (template {:message "Hello {{ "{{first-name" }}}}"}}))

(send twilio sms {:to-phone-number *phone-number*
                  :from-phone-number "1-506-555-1234"}
  (template {:message +TM1
             :twil-ml +TM3}))
{% endhighlight %}

### success and failure

{% highlight clojure %}
(success <then>)
(failure <then>)
{% endhighlight %}

The `success` and `failure` options can be used to provide additional actions to be
taken based upon the success and/or failure of a command. One does not need to define both success
and failure option if not required.

In the presence of an `failure` option the failure of the command is swallowed and the reaction
will continue processing after evaluating the *then* commands. The `failure` option will only be
evaluated once a command has exhausted all of its defined retries.

The `success` block is the only scope in which commands have access to the endpoint response
values (those prefaced with a `$`). If the persistence of a response value is required for the
duration of the reaction, a `set` command can be used to persist the value in a reaction variable.

#### Send an SMS then send a different message to Echo depending on the success of the SMS
{% highlight clojure %}
(send twilio sms {:to-phone-number *phone-number*
                  :from-phone-number "1-506-555-1234"}
  (success (send echo message {:message "It sent"}))
  (failure (send echo message {:message "It did not send"})))
{% endhighlight %}

## Large Example

Here is a large example so that you can see how the DSL create complex notifications in a very simple manner.

{% highlight clojure %}
(par (send twilio sms {:to-phone-number *to-phone-number*}
           (template {:message *TM3*}))
     (seq (send echo message {:message *eventType*}
                (success
                 (set twilio-message *TM1*))
                (failure
                 (set twilio-message *TM2*)))
          (send twilio sms {:to-phone-number *to-phone-number*}
                (template {:message twilio-message})
                (success
                 (set sms-id $call-id)))
          (send vht set-top-pop {:message "Hello"
                                 :target "127.0.0.1"}
                (within 5 minutes)
                (success
                 (seq
                  (send echo message {:message $pop-id})
                  (set pressed-ok $pop-id))))
          (if pressed-ok
            (send echo message {:message "Pressed OK"}))
          (retries 3)
          (within 30 minutes)
          (failure
           (seq
            (send echo message {:message *custId*})))))
{% endhighlight %}
