---
layout: platform
title: Processes
prev_section: nodes
next_section: tenants
permalink: /4.2/docs/platform/processes/
version: 4.2
categories: ['platform']
---

A *process* represents the running instance of a service. The process is comprised
of three pieces of information: an *instance* id, a *service* id, and a *node* id.
Processes are automatically assigned an id which is universally unique.

The values within a process are immutable. If one wishes to change a value in the
process, a new process will have to be created.

When multiple processes reference the same instance and service ids, then those processes
are said to form a cluster. When starting the service through the Platform API, all of the
processes associated with the service will be started, and they will coordinated amongst themselves
to choose a leader to which all incoming messages will be routed. The remaining processes will
wait in a hot-fail-over mode, in case the current leader fails. In addition to the hot fail over
running processes are executed using runit, which will restart the process in case of failure.

The exception to the hot-fail-over scenario are services which have a broker service managing their traffic.
In this scenario, the broker service will load balance message across the entire cluster. This feature
is only available for the Engine and Notification services.

Using the Platform API, one can start, stop, and check the status of a process.
When a process is started, the corresponding jars are deployed to the node and
the jar is started.
