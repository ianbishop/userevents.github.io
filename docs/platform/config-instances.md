---
layout: platform
title: Instances
next_section: config-tenants
permalink: /docs/platform/config-instances/
categories: ['platform']
---

Instances are created and managed through the CxEngage Platform API. The ID for the instance will be automatically generated
upon creation.

## Parameters
### Mandatory

**name**<br>
A human-friendly name of the instance. This value is never exposed to users.

**zk**<br>
The URLs of the Zookeeper Ensemble. The entire ensemble should be defined (comma separated).

**redis**<br>
URL of the Redis instance. This URL should use the *redis://* protocol.

### Optional

**auth**<br>
URL to the CxEngage Auth service. Required if any of the contained services use authentication.

**api**<br>
URL to the CxEngage REST API. Required if any of the contained services use the CxEngage REST API.

**events**<br>
URL to the CxEngage REST Receiver. Required if any of the contained services generate events which are sent back through the REST Receiver.

**stats**<br>
JSON object defining where to report platform statistics. The CxEngage platform has the capability to report statistics regarding its health and performance to either a graphite or a ganglia server. If the stats parameter is defined for the instance, then all services running within will report their statistics using the provided settings.

### Stats Options

**type**<br>
Type can either be *graphite* or *ganglia*

**url**<br>
The URL where the stats should be reported.

**port**<br>
The port to use with the above URL

**prefix**<br>
The prefix to add to all the metric names. This can be used to group data and prevent the metrics from merging with previous entries.
