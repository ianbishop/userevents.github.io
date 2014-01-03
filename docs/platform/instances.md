---
layout: platform
title: Instances
next_section: services
permalink: /docs/platform/instances/
categories: ['platform']
---

An *instance* is a collection of CxEngage services which support a set of
tenants. Each instance is uniquely identifiable by its ID and must be given a
user-friendly name.

An instance is comprised of four parts; *services*, *nodes*, *processes* and *tenants*.

## Services

Services provide a high-level description of how a CxEngage service should be deployed. These descriptions include attributes such as the type of services, its
log level and other essential information.

Please visit the [Services]({{ site.url }}/docs/platform/services) article for more information.

## Nodes

Nodes provide a description of a particular box for CxEngage services to be
deployed onto. These descriptions include attributes such as the box's ip
address and credentials.

Please visit the [Nodes]({{ site.url }}/docs/platform/nodes) article for more
information.

## Processes

Processes are uniquely identifiable deployments of a given *service* onto a given
*node*. Some services in the CxEngage ecosystem are clusterable; the overall
descriptor of how the services are configured would be a *Service*.

Please visit the [Processes]({{ site.url }}/docs/platform/processes) article for
more information.

## Tenants

Tenants are ..

Please visit the [Tenants]({{ site.url }}/docs/platform/tenants) article for
more information.
