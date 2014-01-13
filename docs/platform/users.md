---
layout: platform
title: Users
prev_section: integrations
permalink: /docs/platform/users/
categories: ['platform']
---

*Users* represent the consumers of the CxEngage API and event producers. A user can have access to multiple
tenants if only interacting with the CxEngage API, if the UI is used, a user should only be granted access to
a single tenant. Users authenticate with CxEngage through the use of OAuth2.0 by way of the CxEngage Auth Service.
Token expiration can be configured by tenant if needed. A user's access to a tenant can be revoked (or added) at anytime and
the change is immediate.

When using the UI, a user only requires their username and password to access CxEngage. All other interaction with CxEngage
is authenticated using a token requested from the Auth Service using their Client ID and Client Secret. The Client ID and
Client Secret for a user are available from an admin through the Platform API or by the user through the UI.
