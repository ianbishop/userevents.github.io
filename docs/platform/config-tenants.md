---
layout: platform
title: Tenants
prev_section: config-integrations
permalink: /docs/platform/config-tenants/
categories: ['platform']
---

Tenants can be created using the Platform API. Unlike other entities in the CxEngage Platform, tenants
do not have auto generated ids. Tenant ids are provided by the admin at the time of creation and must be
unique for the whole platform.

There are some additional configuration keys which can be specified in the tenant object to alter the functionality of the tenant:

**auth?**<br>
When set to false, the auth? key will remove the need for OAuth with this tenant. This can be convenient for internal testing,
or for instances which are not publicly exposed. Default is *true*.

**streaming?**<br>
When set to true, the streaming? keys allows users of the tenant to use the WebSocket capabilities of the Rest Receiver.
Default is *false*.

**rate-limit**<br>
The rate-limit key sets the rate at which a tenant can accept events into the rest receiver per second. Default is *100*.

**active?**<br>
When set to false, the active? key will disable this tenant in all services. Default is *true*.
