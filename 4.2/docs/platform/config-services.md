---
layout: platform
title: Services
next_section: config-integrations
prev_section: config-nodes
permalink: /4.2/docs/platform/config-services/
version: 4.2
categories: ['platform']
---
Services are created and managed using the CxEngage Platform API. Service IDs are automatically generated upon creation.
All services have a common subset of parameters which will be outlined next, following those are definitions of all CxEngage services and any service specific settings they may have.

## Common Parameters
### Mandatory

**type**<br>
This parameter defines the type of service being described. Valid values will be outlined in the service breakdowns below.

**name**<br>
A human readable name for this service. This name has no bearing on the service's type or function.

**log-level**<br>
The log level for the service. Valid values (in order of verbosity from most to least) are trace, debug, info, warn, and fatal.
This value can be changed while the service has running processes and the level will change at runtime.

## Service Types

The following is a listing of CxEngage Services and any service specific settings they may have.

### CxEngage Rest API

Type: **cxengage-api**

The CxEngage Rest API is the public facing API which users use to manage their associated tenants.

Additional options to specify in the service options map are:

**port**<br>
The port on which to attach the API.

### Auth Service

Type: **auth**

The Auth Service is used to authenticate users within the CxEngage Platform.
Additional options to specify in the service options map are:

**port**<br>
The port on which to attach the Auth Service.

**token-ttl**<br>
This key is optional. The value should be the number of seconds a token will be valid for. The default is: 2592000

### Web UI

Type: **webapp**

The UI is a consumer of the CxEngage Rest API, and is a convenient and familiar way for users to manage their instance.

Additional options to specify in the service options map are:

**port**<br>
The port on which to attach the UI.

### Rest Receiver

Type: **rest**

The Rest Receiver is the main entry point for events into the CxEngage Platform. Users submit events using
either a REST interface or, if enabled for the tenant, a streaming WebSocket interface.

Additional options to specify in the service options map are:

**port**<br>
The port on which to attach the Receiver

**downstream**<br>
The downstream key defines the service id which the receiver will send its events. This value can be changed at runtime and
the receiver will redirect its event stream. Typically the downstream service would be the augment, broker, or engine service.

**pipeline-port**<br>
The port on which to bind the incoming message pipeline. If the key is not specified a random port will be chosen.

**command-port**<br>
The port on which to bind the outgoing command pipeline. If the key is not specified a random port will be chosen.

**event-size**<br>
This key is optional and should only be defined if suggested by support. The event-size controls the max
size of events. The default value is 1024 bytes.

### Augment Service

Type: **augment**

The augment service is responsible for augmenting data into events and reactions as they pass through the service.
A single augments service both an event stream and a reaction stream. The downstream keys will define how these events
will be routed. The augments to perform are defined within each tenant.

Additional options to specify in the service options map are:

**event-downstream**<br>
The service to which augmented events will be routed. This value can be changed at runtime. Typically the downstream
service will be either the broker or the engine.

**notification-downstream**<br>
The service to which augmented reactions will be routed. This value can be changed at runtime. Typically the downstream
service will be either the notification or broker service.

**pipeline-port**<br>
The port on which to bind the incoming message pipeline. If the key is not specified a random port will be chosen.

**command-port**<br>
The port on which to bind the outgoing command pipeline. If the key is not specified a random port will be chosen.

### Broker

Type: **broker**

The broker service will manage a cluster of services and both provide persistence for high availability and load balancing
for the cluster. The broker is only supported for the Engine and Notification services.

Additional options to specify in the service options map are:

**downstream**<br>
The service which the broker is to manage. The broker only supports Engine and Notification type services.

**pipeline-port**<br>
The port on which to bind the incoming message pipeline. If the key is not specified a random port will be chosen.

**command-port**<br>
The port on which to bind the outgoing command pipeline. If the key is not specified a random port will be chosen.

### Engine

Type: **engine**

The engine service is responsible for evaluating and executing the when portion of patterns. The engine keeps all
of its state in memory, and as such can be susceptible to faults. Use of the broker service in front of the engine
removes this limitation.

Additional options to specify in the service options map are:

**downstream**<br>
The service to which the engine will send any resulting reactions. This value can be changed at runtime. Typically the downstream service will be either
the augment, notification, or broker service.

**pipeline-port**<br>
The port on which to bind the incoming message pipeline. If the key is not specified a random port will be chosen.

**command-port**<br>
The port on which to bind the outgoing command pipeline. If the key is not specified a random port will be chosen.

**shelves**<br>
The shelves key controls the number of worker threads the engine should use when processing incoming events.
The default is 1. Depending on the hardware (# of cores) on which the engine is run, increasing this number
may increase the event throughput of the engine.

**event-size**<br>
This key is optional and should only be defined if suggested by support. The event-size controls the max
size of events. The default value is 16384 bytes.

**reaction-size**<br>
This key is optional and should only be defined if suggested by support. The reaction-size controls the max
size of reactions. The default value is 131072 bytes.

### Notification Service

Type: **notification**

The notification service is responsible for evaluating and executing the then portion of patterns. Like the engine,
the notification service keeps all of its state in memory and requires a managing broker to achieve fault tolerance.
At start up, the notification service will attempt to identify all services which correspond to an integration. As such
adding a new integration to the platform will require a restart of the notification service. To remove downtime, this restart
can be done as a rolling restart of the notification cluster.

Additional options to specify in the service options map are:

**downstream**<br>
The service to which the notification service will send any resulting journal entries. This value can be changed at runtime. Typically the downstream service will be one of the journaling services.

**updates**<br>
The service to which the notification service will publish reaction updates. Typically the updates service will be the broker service managing the notification service.

**pipeline-port**<br>
The port on which to bind the incoming message pipeline. If the key is not specified a random port will be chosen.

**command-port**<br>
The port on which to bind the outgoing command pipeline. If the key is not specified a random port will be chosen.

**shelves**<br>
The shelves key controls the number of worker threads the notification service should use when processing incoming reactions.
The default is 1. Depending on the hardware (# of cores) on which the notification service is run, increasing this number
may increase the reaction throughput of the notification service.

**notification-size**<br>
This key is optional and should only be defined if suggested by support. The notification-size controls the max
size of notifications. The default value is 2048 bytes.

**reaction-size**<br>
This key is optional and should only be defined if suggested by support. The reaction-size controls the max
size of reactions. The default value is 131072 bytes.

**journal-size**<br>
This key is optional and should only be defined if suggested by support. The journal-size controls the max
size of journal entries. The default value is 262144 bytes.

### Elastic Search Journaler

Type: **es-journal**

The Elastic Search Journaler will commit journal entries to the configured elastic search cluster.

Additional options to specify in the service options map are:

**cluster-name**<br>
The name of the elastic search cluster

**endpoints**<br>
The elastic search endpoints to write to. This parameter should be defined as a list of lists consisting of the ip and port of each endpoint. Like so:

```json
[["192.168.0.17", 9300]
 ["192.168.0.16", 9300]]
```

**journal-path**<br>
The path where the persistent queue of journal entries should be stored. The default is "journal.jnl".

**pool-size**<br>
The size of the worker pool writing into the elastic search cluster. Default is 3.

**pipeline-port**<br>
The port on which to bind the incoming message pipeline. If the key is not specified a random port will be chosen.

**command-port**<br>
The port on which to bind the outgoing command pipeline. If the key is not specified a random port will be chosen.

**reaction-size**<br>
This key is optional and should only be defined if suggested by support. The reaction-size controls the max
size of journal entries. The default value is 262144 bytes.

## Listeners

None of the provided listeners support additional options. Available listener types are:

* **datasift** A DataSift Listener
* **pusher-listener** A Pusher Listener
* **salesforce-listener** A Salesforce Listener

## Endpoints

All endpoints support the following additional options parameters:

**downstream**<br>
The service to which the endpoint will send any resulting notifications. This value can be changed at runtime. Typically the downstream service will be either the notification or broker service.

**pool-size**<br>
The number of concurrent worker the endpoint should use when processing incoming notifications. Default is 3

**pipeline-port**<br>
The port on which to bind the incoming message pipeline. If the key is not specified a random port will be chosen.

**command-port**<br>
The port on which to bind the outgoing command pipeline. If the key is not specified a random port will be chosen.

**notification-size**<br>
This key is optional and should only be defined if suggested by support. The notification-size controls the max
size of notifications. The default value is 2048 bytes.

Below is a listing of all bundled endpoints and any additional parameters they accept.

### Echo

Type: **echo**

This is a testing endpoint. All it does is echo back the parameters sent.

### Generic

Type: **generic**

The generic endpoint allows for generic communication using WebSockets to stream outgoing notifications.
Bi-directional communication is also supported.

Additional options to specify in the service options map are:

**port**<br>
The port to bind the REST and WS server to.

### Timer

Type: **timer**

The timer endpoint allows for the scheduling of persistent timers which execute arbitrary *then* code
upon execution.

### Pusher

Type: **pusher**

The pusher endpoint allows for the creation of pusher events.

### Sendgrid

Type: **sendgrid**

The sendgrid endpoint allows for the sending of emails through sendgrid.

### Salesforce

Type: **salesforce**

The salesforce endpoint allows for the creation of items in salesforce.
