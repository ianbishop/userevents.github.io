---
layout: platform
title: Nodes
next_section: config-services
prev_section: config-tenants
permalink: /4.1/docs/platform/config-nodes/
version: 4.1
categories: ['platform']
---
Nodes are created and managed through the Platform API. The ID for the node is generated upon creation.
Any reference to a node should use the generated ID.

## Parameters

### Mandatory

**name**<br>
The Human readable name for the node.

**ip-address**<br>
The IPv4 address of the machine this node represents

**username**<br>
The username of a user on this node which will be used for deploying processes.

**password**<br>
The password for the above user.
