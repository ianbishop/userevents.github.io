---
layout: docs
title: CxEngage DSL
prev_section: intro-dsl
permalink: /4.2/docs/dsl/
version: 4.2
categories: ['docs']
---

The new DSL being provided by CxEngage 4.0 will allow for far more robust and meaningful patterns.
The Iris engine will allow for the interleaving of event collection and endpoint interaction.

## Core Concepts

### Event Collection

The collection of events is accomplished using a combination of logical operators and the *event* keyword.

For example:

If I was looking for an event in which the **priority** field was "high" and the **type** field was "purchase",
the following event command would match on such events.

```clojure
(event {:priority "high"
        :type "purchase"})
```

The map after the event keyword describes the event we are looking to collect. Keywords represent the field name within the event.
If a constant value is provided for the value, this is assumed to mean equality. Enumerations are supported as follows:

```clojure
(event {:priority #{"high" "medium"}
        :type "purchase"})
```

Which would collect an event with the **priority** field value of either "high" or "medium". More complicated predicates are also
permitted. Any binary predicates will implicitly have the event value substituted into the first position of the predicate.

```clojure
(event {:priority "high"
        :type "purchase"
        :amount (and (> 50000)
                     (< 100000))})
```

Which will collect an event with an **amount** value between 50,000 and 100,000.

Each event command will only proceed if all of its contained criteria are met by a single event.
Multiple event commands can be combined using the commands:
* times
* sequence
* and
* or
* within

Each event statement will be matched to a distinct event. This means that for each event command
in the execution path of your pattern, the engine will consume an equal number of events.

```clojure
(and (event {:priority "high"
             :type "purchase"})
     (event {:amount (> 50000)}))

; This statement can only be matched by two events
; Assume :id is the key attr for the pattern

; These two events (received in any order) would cause a match to occur
{:id "john"
 :priority "high"
 :type "purchase"}

{:id "john"
 :amount 100000}

; This single event would not cause a match to occur
{:id "john"
 :priority "high"
 :type "purchase"
 :amount 100000}
```

### Endpoint interaction

Patterns are, at their core, are just event collections and endpoint interactions. Interactions are different
based on the endpoint being communicated with, but all interactions follow the same form. The following verbs
are available for endpoint interaction (but not all may be available for the endpoint):
* fetch
* perform
* create
* update
* delete

Each interaction type takes the same form:

```clojure
(verb endpoint action {params} options)

(create twilio call {:to "555-1234"
                      :from "555-4321"
                      :message (template +TM1)}
                      (retries 3)
                      (timeout 2 minutes))
```

Values provided to a key in the parameter map of an interaction can take multiple forms:
* Constants (booleans, strings, or numbers)
* Collections (either maps or vectors)
* Templated values (referencing either a template value or a string)
* Expressions (which evaluate to a constant)

Additional options can be provided to an endpoint interaction to alter its execution:
* retries -- how many times this interaction will be attempted
* timeout -- how long to wait for the interaction to complete
* catch -- capture the interaction's failure and do the contained commands

Results of the interaction can be captured by binding the interaction to a variable.
Interactions which are not bound will be executed in parallel. For Example:

```clojure
; Since the following interactions are being bound to variables, they will be executed sequentially
(let [email-result (create sendgrid email {...})
      ;; email-result is now available for use
      call-result (create twilio call {...})
      ;; call-result is available for use
      sf-case (create salesforce case {...}])
```

### Variables

#### Implicit

At any point in the pattern the values contained in the current event context can be accessed.
To access a field in the context, prefix the field name with the $ symbol.

```clojure
;; Events in this pattern have the fields: id, amount, and type

(perform echo message {:message $id})
(perform echo message {:message $amount})
```

Access the value in the context will always return the last value seen for that event field.
If access to all consumed values is required, the *all* command will return a list of all values
received under that field for this match.

```clojure
(let [total-amount (sum (all $amount))]
  (perform echo message {:message total-amount}))
```

#### Maps

Users can access values stored in map structures using the dot syntax. All endpoint interactions
return an map as their result. For Example:

```clojure
(when-let [result (create twilio call {...})]
  (perform echo message {:message result.sid}))
```

Using a dot followed by the field name will allow one to extract the value from the contained field.
The dot syntax can also be used within templates to reduce the number of bindings required.

```clojure
(when-let [result (create twilio call {...})]
  (perform echo message {:message (template "Made a call to {{result.sid}}"})))
```

#### User Defined
There are multiple ways to store, mutate, and access variables in the Iris DSL.

Global variables can be defined using the *def* construct, and can be mutated using the *set* command.

```clojure
(def company-name "acme")
(set company-name "acme-inc")
```

Local variables can be defined with one of three constructs:
* let
* if-let
* when-let

Variables defined using these constructs will only be available for use within the binding, and discarded afterwards.
If a scoped variable shadows a global variable the local value will be used within the local binding scope.

```clojure
(let [company-name "acme"
      message "Hello world"]
  (create twilio call {:message message}))
```

The *if-let* and *when-let* binding forms are very useful for collecting and acting on the results of an endpoint interaction.
If the value expression in the binding statement evaluates to a truthy value, the resulting value will be bound to the variable
name provided and the *then* portion of the expression will be executed.

```clojure
(when-let [result (create twilio call {...})]
  ;; This part will be executed if the call was successful
  (perform echo message {:message result.sid}))

(if-let [result (create twilio call {...})]
  ;; This part will be executed if the call was successful
  (perform echo massage {:message result.sid})
  ;; This part will be executed if the call was not successful (and result is not bound)
  (perform echo message {:message "Call failed"}))
```

### Math

The Iris DSL supports basic math and statistics functions on numeric values and lists of numeric values.

Supported non list math functions are:

* + -- plus

* - -- minus

* * -- multiply

* / -- divide

* mod -- modulo
* quot -- integer division
* rem -- remainder
* gcd -- greatest common divisor
* lcm -- least common multiple
* rand -- generate random integer
* pow -- power
* abs -- absolute value
* floor -- floor
* ceil -- ceiling
* sqrt -- square root
* inc -- increment by one
* dec -- decrement by one

List math functions are:

* sum -- sum the list
* min -- find min value in the list
* max -- find max value in the list
* avg -- average of the list
* stdev -- standard deviation of the list
* count -- length of the list

In addition to functions which produce numbers, there are also a number of numerical
predicates available for use. When using the binary numeric predicates, order of the parameters matters.

```clojure
;; This means 5 > 1
(> 5 1) ;true
;; This means 1 > 5
(> 1 5) ;false
```

Unary Numeric Predicates
* even? -- true if number is even
* odd? -- true if number is odd
* zero? -- true if number is zero
* pos? -- true if number is > 0
* neg? -- true if number is < 0

Binary Numeric Predicates
* < -- less than
* <= -- less than or equal to
* > -- greater than
* >= -- greater than or equal to
* = -- equal to

### Collections

The Iris DSL supports basic collections. Collections can be passed in through
events, created as constants, and are returned as the results of endpoint interactions.

The two types of collections are maps and lists. Maps are pretty limited in the functions
and operations that can be performed on them, basically you can only extract values using the dot operator.
Lists have numerous types of available operations. Both maps and lists are treated as immutable.

Lists can be filtered based on a provided predicate using the *filter* and *remove* operations. These
operators will return an new list which match (filter) or don't match (remove) a provided predicate.

```clojure
;Remove all amounts less than 10
(def amounts (remove (< 10) (all $amounts)))

;The same result can be achieved using filter
(def amounts (filter (>= 10) (all $amounts)))
```

List members can be accessed using the following commands:

```clojure
(def list [1 2 3 4 5])

;The first and last elements can be accessed using first and last
(first list) ; 1
(last list) ; 5

;Specific list items can be extracted with nth (note lists are zero indexed)
(nth list 2) ; 3
```

### Branching Constructs

Branching constructs allow you to decide which portions of your pattern are executed based on the evaluation
of predicates.

Available branching constructs are:
* if
* when
* if-let
* when-let
* cond
* case
* unless

The most common branching mechanism is the *If* statement. This allows you to run a predicate and then chose
one of two branches (then or else) based on the result of the predicate. The then and else portions of the *If*
are single s-expressions, therefore if there are multiple actions to perform in a branch a *do* block will be required.

```clojure
;;Syntax
;; (if predicate then else)

(event {:type 3
        :amount (> 200)})

(if (> $amount 500)
  (perform echo message {:message "That's a big amount"})
  (perform echo message {:message "That is a small amount"}))
```

The *When* construct is similar to the *If* statement except the body is only executed if the predicate is true.
As there is only one branch in a *when* statement, multiple actions can be nested withing the block.

```clojure
;;Syntax
;; (when predicate then*)

(event {:type 3
        :amount (> 200)})

(when (= 300)
  (perform echo message {:message "The amount is 300"}))
(perform echo message {:message "Thanks for the money"})
```

*if-let* and *when-let* follow the same semantics as their non-let versions, except they will bind the result of the predicate
to the defined variable.

```clojure
;;Syntax
;; (if-let [var-name predicate] then else)
;; (when-let [var-name predicate] then*)

(event {:type 3
        :amount (> 300)})

(if-let [result (perform echo message {:the-amount $amount})]
   (perform echo message {:message (template "The amount was: {{result.the-amount}}")})
   (perform echo message {:message "Something went wrong"}))
```

*cond* is a useful construct for when you want to test multiple predicates in a row, and only act on one.
*cond* can replace cascading if statements. A single action can optionally be provided at the end, which will be a default.

```clojure
;;Syntax
;; (cond predicate then predicate then ...)

(event {:type 3
        :amount (> 100)})

(def m "")

(cond
  (= 200 $amount) (set m "Two Hundred")
  (> $amount 500) (set m "Big amount")
  (< $amount 400) (set m "Small amount")
  (set m "Medium amount"))

(perform echo message {:message m})
```

*case* is similar to *cond* in that it tests multiple predicates, but *case* tests against a single variable and can only test
for equality against constants. The trade off is that the case statement can be executed in constant time, whereas cond or cascading ifs
are executed in linear time. An optional default action can be provided at the end of the case statement.

```clojure
;;Syntax
;; (case variable test action test action ...)

(event {:type 3
        :amount (> 100)})

(def m "")

(case $amount
  200 (set m "Two Hundred")
  300 (set m "Three Hundred")
  400 (set m "Four Hundered")
  (set m "Something else"))

(perform echo message {:message (template "Your amount was {{m}}")})
```

*unless* is different than the other branching constructs as it tests the predicate in-between each action, and if the
predicate evaluates to true the block will be stopped.

```clojure
;;Syntax
;; (unless predicate actions)

(event {:type "start"
        :amount (< 200)})

(def counter 0)
(unless (>= counter 10)
  (times 20
    (do
      (perform echo message {:message "Hello World"})
      (set counter (inc counter)))))
```

### Looping Constructs

There is only one looping construct in the Iris DSL, *until*.
Like *unless*, *until* will test a predicate after each action.
*Unless* will continuously execute its block until the predicate evaluates to true.

```clojure
;;Syntax
;; (until predicate actions)

(event {:type "start"})
(until (event {:type "stop"})
  (perform echo message {:message "DING"})
  (delay 10 seconds))
```

## Examples

### Car Service
A customer who has had their car serviced more than 4 times in the last month

```clojure
(def dealership "dealer@carco.com") ;; global variables
(def manager "+15552334444")

(within 30 days
  (times 4
    (event {:product "car"
            :type "service"})))

(let [total-maintenance (sum (all $maintenance-cost))] ;; sum the "maintenance-cost" attribute in all events
  (create sendgrid email {:to dealership})
  (when (> total-maintenance 5000)
    (create twilio sms {:to manager})))
```
### Cell Phone Bill
A customer who has had their monthly cell phone bill be over 500% of their regular bill
for the last 3 months

```clojure
(def count 0)
(let [plan-amount (fetch telco plan-amount {:id $cust-id})]
  (until (= count 3)
         (event {:product "cell"
                 :type "monthly-bill"})
         (if (> $bill-amount (* plan-amount 5))
           (set count (inc count))
           (set count 0)))
  (if-let [case (create salesforce case)]
    (create sendgrid email {:body (template +TM1)})
    (create sendgrid email {:body (template +TM2)})))
```
### Callback and get the same agent
A customer calls in, has their issue handled, but realizes they forgot something and calls
back. Can they get the same agent?

```clojure
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
```

### SF VOD Use Case

```clojure
(def callcenter-id "181")
(def campaign-id "92428")

(within 10 minutes
  (sequence
    (event {:type "movie-store"
            :page "failed-movie-purchase"})
    (event {:type "knowledge-base"
            :page "failed-vod"})
    (event {:queue-name "DigitalTV"})
    (event {:queue-result "hangup"})
    (event {:type "login"})))

(when-let [pop-up (create generic notification {:body (template +TM1)})]
  (if (fetch generic notification {:id pop-up.id}
             (timeout 60 seconds))
    (when-let [case (create salesforce case {:description "Test"})]
      (create liveops callback {:address $Phone
                                :callcenter-id callcenter-id
                                :campaign-id campaign-id
                                :attributes {:search_sfdc_object_id case.id}}))
    (create sendgrid email {:to $Email
                            :from "sales@userevents.com"
                            :subject (template +TM2)
                            :text (template +TM3)})))
```
### ISP Outage

An ISP or media­delivering­company (online movie store, etc) has an outage for a
specific set of customers. We detect who has the outage, and if they try to contact the
contact center through any channel, they’re delivered a pre­emptive message that
nobody else hears or sees

```clojure
(event {:status "call-started"})
(if-let [status (fetch appstore status {:id $cust-id})]
  (case status
    "red" (perform liveops route {:to (template +TM7)}) ;; special degradation of service message
    "yellow" (perform liveops route {:to (template +TM9)}) ;; you may be experiencing degredation of service
    (perform liveops route {:to (template +TM2)})) ;; route to normal IVR
  ;; failed status, route to normal IVR
  (perform liveops route {:to (template +TM2)}))
```
### Queue Time Threshold
When queue times go above a certain threshold, display a message in the chat window
to let the user be notified by e­mail when the chat queue time goes below 5 minutes.

```clojure
;;key attribute is custId

(event {:type "chat"
        :status "enqueue"})

(when-let [result (fetch livechat est-wait {:id $queue-id})]
  (when (> result.wait 60)
    (create livechat message {:id $chat-id
                              :message "Esimated wait-time is over an hour. We will notify you by email
                                        when queue times are below 5 minutes."})
    (create livechat schedule-email {:queue-id $queue-id
                                     :to $email
                                     :from "care@liveops.com"
                                     :body (template +TM9)})))

;; queue them for an agent anyway
(when-let [rep (fetch livechat agent {:id $chat-id
                                      :attributes {...}})]
  (perform livechat connect {:id $chat-id
                             :rep-id rep.id}))

;; key attribute is chat queue id

(event {:type "queue-time"
        :est-wait (<= 5)})
(create livechat send-scheduled-emails {:queue-id $queue-id})
```
### 1000th Customer Deal
The 100th order of pizza containing a 2L of Pepsi gets 10% off their order

```clojure
;; key attribute: type

(times 100
  (event {:type "order"
          :status "new"
          :items (contains? "2L_PEPSI")}))
(update pizzahut order {:id $id
                        :price (* $price 0.9)})
```
### SMS Pizza Delivery
When a customer's pizza is ready for delivery, send them
an sms with the estimated delivery time if available

```clojure
(event {:type "order"
        :status "deliver"})
(when-let [wait-time (fetch pizzahut est-deliver {:address $address
                                                  :store $store})]
  (create twilio sms {:to $phone-number
                      :from "+15553335555"
                      :message (template +TM10)}))
```
### Purchaser Prioritize
If somebody is scored in your marketing automation software as having a high likelihood
of purchasing, prioritize them in queue.

```clojure
(event {:type "enqueue"
        :exacttarget-score (> 500)})
(update liveops call {:id $interaction-id
                      :priority (+ 5 $priority)})
```
### Persist Escalation
User calls one department, is escalated to another, drop from the queue.
Calling back, they're chucked back into the escalation queue, previous case information is pushed to escalation agent.

```clojure
(within 5 minutes
  (sequence
    (event {:type "drop-queue"})
    (event {:type "call-started"})))

(when-let [data (fetch liveops call {:id (first (all $interaction-id))})]
  (update liveops call {:id $interaction-id :data data}))

(perform liveops enqueue {:id $interaction-id
                          :queue-id $queue-id})
```
