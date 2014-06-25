---
layout: platform
title: Instances
next_section: services
permalink: /4.2/docs/platform/instances/
version: 4.2
categories: ['platform']
---

An *instance* is the mechanism by which CxEngage services are grouped.
Each instance is automatically assigned an ID (eg *IN2*) which is used when
referencing the instance. Instances are exclusively exposed through the Platform API.
Non-admin users of CxEngage will never be exposed to the instance.

An instance is comprised of four parts: [Services]({{ site.url }}/4.2/docs/platform/services), [Nodes]({{ site.url }}/4.2/docs/platform/nodes), [Processes]({{ site.url }}/4.2/docs/platform/processes), and [Tenants]({{ site.url }}/4.2/docs/platform/tenants).
Service and node definitions are contained within a specific instance, whilst process
and tenant definitions only refer to specific instances and are not contained within the instance definition.
