---
layout: platform
title: Nodes
prev_section: services
next_section: processes
permalink: /4.2/docs/platform/nodes/
version: 4.2
categories: ['platform']
---

A *node* is a reference to a physical machine on which CxEngage services will be deployed.
Nodes are automatically assigned instance unique identifiers of the form: ND**\<id\>**.
The use of the described node is limited to its containing instance. At a minimum the machine
described must have access to the ZooKeeper ensemble used by CxEngage. Additional connections
and level of visibility may be required based on the processes deployed to the node.

When starting a [process]({{ site.url }}/docs/platform/processes), the Platform API will be
creating an ssh connection to the machine described by the *node* to deploy and start the service
the process refers to.
