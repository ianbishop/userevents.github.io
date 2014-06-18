---
layout: platform
title: Services
prev_section: instances
next_section: nodes
permalink: /4.1/docs/platform/services/
version: 4.1
categories: ['platform']
---

A *service* represents a single component of the CxEngage Platform. A service does
not represent the actual running software, rather the configuration that a process
will reference when executing. Services definitions are defined within an instance
and are unable of communicating with services in different instances. An instance
unique id will be assigned to each service upon creation of the form SV*\<id\>*.

The topology of the CxEngage Pipeline is defined completely through the service configuration.
Each service defines which service is directly downstream from them.

The majority of settings contained within a service can be updated and take affect while the associated
process are running. For example the log-level of the service can be changed at run-time.
