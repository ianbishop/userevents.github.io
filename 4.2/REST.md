# API

The CxEngage REST API enables you to manage your user and its tenants.

If you are building an application which will manage patterns, templates or
other core CxEngage objects then this API is built for you.

## Authentication

CxEngage uses OAuth 2.0 to provide authentication for all API resources
including the REST API and event submission.

[More on Authenticating >](http://docs.cxengage.com/docs/authentication/)

## Errors

CxEngage REST API uses standard HTTP response codes for errors.

Code | Description
-- | --
**200 OK** | Everything worked as expected
**201 Created** | Your item was successfully created
**204 No Content** | Your item was successfully deleted
**400 Bad Request** | Missing a required parameters
**401 Unauthorized** | Incorrect credentials
**403 Forbidden** | User does not have access to the requested tenant
**404 Not Found** | The requested tenant or item does not exist
**500 Server Error** | Something bad happened on our end, please contact support

All responses are accommodated with a human-readable `error` field in a JSON object to ease debugging.

## Versioning

We version our API to protect you from backwards-incompatible changes.

Version | Endpoint
-- | --
**1.0** | **https://api.cxengage.net/1.0/**

## Sending in Events

It is often helpful to test your changes by sending in custom events.

[More on Custom Events >](http://docs.cxengage.com/docs/custom-events/)

# Methods

## Account

A user in CxEngage may be associated with many tenants. A user may submit events or modify any tenant they have been access to. These methods all pertain to your **current** user.

#### Attributes

Name | Type | Description
--- | --- | ---
**email** | **string** | Email of the account
**name** | **string** | Name of the account owner
**client-id** | **string** | Client ID Credential
**ttl** | **number** | Remaining session time *(seconds)*
**tenants** | **array** | List of accessible tenants

> Example Object

```json
{
    "ttl": 2592000000,
    "client-id": "Dk5w6yi5mOfN+HRcwDmxEN...",
    "tenants": [
        "userevents"
    ],
    "name": "Ian Bishop",
    "email": "ian.bishop@userevents.com"
}
```

[More on Users >](http://docs.cxengage.com/docs/platform/users/)

### Retrieve Account

Retrieve the details of the current authenticated user.

> Definition

```
GET https://api.cxengage.net/1.0/account
```

#### Arguments

None.

> Example Request

```
curl -X GET https://api.cxengage.net/1.0/account \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns the user object if valid credentials are provided. Otherwise, returns
[an error](#errors).

> Example Response

```json
{
    "ttl": 2592000000,
    "client-id": "Dk5w6yi5mOfN+HRcwDmxEN...",
    "tenants": [
        "userevents"
    ],
    "name": "Ian Bishop",
    "email": "ian.bishop@userevents.com"
}
```

### Change Password

Change the password of the current authenticated user.

> Definition

```
POST https://api.cxengage.net/1.0/account/change_password
```

#### Arguments

Name | Description
--- | ---
**password** | New Password

> Example Request

```
curl -X POST https://api.cxengage.net/1.0/account/change_password \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"password" : "butter"}'
```

#### Returns

Returns an **HTTP 200** if successful. Otherwise, returns [an error](#errors).

### Retrieve Credentials

Retrieve the credentials of the current authenticated user.

> Definition

```
GET https://api.cxengage.net/1.0/account/auth
```

#### Arguments

None.

> Example Request

```
curl -X GET https://api.cxengage.net/1.0/account/auth \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a JSON Object with keys `client-id` and `client-secret` if successful.
Otherwise, returns [an error](#errors).

> Example Response

```json
{
  "client-id": "yyyy",
  "client-secret": "xxxx"
}
```

### Retrieve Accessible Tenants

Retrieves the list of tenant accessible by the current authenticated user.

> Definition

```
GET https://api.cxengage.net/1.0/account/tenants
```

#### Arguments

None.

> Example Request

```
curl -X GET https://api.cxengage.net/1.0/account/tenants \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an array of all accessible tenants if successful. Otherwise, returns [an
error](#errors).

> Example Response

```json
{
  "tenants": [
    {
      "id": "userevents",
      "name": "UserEvents"
    }
  ]
}
```

## Tenants

A tenant describes a virtual partition of a CxEngage instance. A tenant is
provided for each client-organization. As a user of CxEngage, you may have
access to multiple tenants in the system across many instances.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the pattern

> Example Object

```json
{
  "id": "tenant1",
  "name": "My Tenant"
}
```

[More on Tenants >](http://docs.cxengage.com/docs/platform/tenants/)

### Retrieve a Tenant

Retrieve the details of a tenant which your authenticated user has access to.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request

```
curl -X GET https://api.cxengage.net/1.0/tenants/tenant1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a tenant object if a valid tenant is provided, returns [an error](#errors) otherwise.

> Example Response

```json
{
    "id": "tenant1",
    "name": "Tenant One"
}
```


## Patterns

A pattern describes a series of events that make up a customer's journey as they interact with your company across channels. As a user of CxEngage, you write patterns that match journeys which are important to your organization.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the pattern
**description** | **string** | A people friendly description of what this pattern should do
**status** | **boolean** | Whether or not this pattern is being matched against
**code** | **string** | CxEngage DSL of what pattern to look for

> Example Object

```json
{
    "id": "PT1",
    "code": "(event {:type \"hello\"}) (perform echo message {:message \"Hello World!\"})",
    "key": "id",
    "status": true,
    "description": "Hello World Pattern",
    "name": "Hello World"
}
```

[More on Patterns >](http://docs.cxengage.com/docs/patterns/)

### Create a Pattern

Creates a pattern object for specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/patterns
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the pattern
**description** | Description of the pattern
**status** |  Boolean for enabled/disabled state
**code** | CxEngage DSL of what pattern to look for


> Example Request

```
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/patterns \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"code":"(event {:type "hello"}) (perform echo message {:message "Hello World!"})","status":true,"name":"curl Pattern"}'
```

#### Returns

Returns a pattern object if successful, returns [an error](#errors) otherwise. If `status` is set to true, the `code` field must be provided and must be valid CxEngage DSL. If not, [an error](#errors) will occur.

> Example Response

```json
{
    "id": "PT4",
    "code": "(event {:type \"hello\"}) (perform echo message {:message \"Hello World!\"})",
    "key": "id",
    "status": true,
    "description": "Hello World Pattern",
    "name": "Hello World"
}
```


### Retrieve a Pattern

Retrieves the details of an existing pattern for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/patterns/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Pattern ID

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/test123/patterns/PT2 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a pattern object if specified tenant and pattern exist. Returns [an error](#errors) otherwise.

> Example Response

```json
{
    "id": "PT3",
    "code": "(event {:type \"hello\"}) (perform echo message {:message \"Hello World!\"})",
    "key": "id",
    "status": true,
    "description": "Hello World Pattern",
    "name": "Hello World"
}
```

### Update a Pattern

Updates an existing pattern of the specified tenant by setting the values of the provided parameters passed. Any parameters not provided will be unchanged. Your current authenticated user must have access to the specified tenant.

> Definition

```
PUT https://api.cxengage.net/1.0/tenants/{{tid}}/patterns/{{id}}
```

#### Arguments

Name | Description
--- | ---
name | Human-friendly name of the pattern
description | Description of the pattern
status |  Boolean for enabled/disabled state
code | CxEngage DSL of what pattern to look for


> Example Request

```
curl -X PUT https://api.cxengage.net/1.0/tenants/test/patterns/PT5 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"name" : "hello world2"}'
```

#### Returns

Returns the pattern object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
 {
    "id": "PT3",
    "code": "(event {:type \"hello\"})\n(perform echo message {:message \"Hello World!\"})",
    "key": "id",
    "status": true,
    "description": "Hello World Pattern",
    "name": "Hello World2"
}
```

### Delete a Pattern

Permanently deletes a pattern. It cannot be undone. Immediately stops matching events against the deleted pattern. Your current authenticated user must have access to the specified tenant.

> Definition

```
DELETE https://api.cxengage.net/1.0/tenants/{{tid}}/patterns/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Pattern ID

> Example Request

```
curl -IX DELETE https://api.cxengage.net/1.0/tenants/tenant1/patterns/PT1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Patterns

Returns a list of all patterns for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/patterns
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID


> Example Request

```
curl -XGET https://api.cxengage.net/tenants/tenant1/patterns \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an array containing all patterns if the specified tenant exists. Returns [an error](#errors) otherwise.

> Example Response

```json
[
{
    "id": "PT3",
    "code": "(event {:type \"hello\"})\n(perform echo message {:message \"Hello World!\"})",
    "key": "id",
    "status": true,
    "description": "Hello World Pattern",
    "name": "Hello World2"
}
]
```

## Templates

A template is used for creating messages that will be used in a notification. These templates allow you to insert variables from the event, responses from other notifications, or augmented values to create a personalized notification for your customers.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the template
**description** | **string** | A people friendly description of what this template should do
**template** | **string** | Template message which supports Mustache

> Example Object

```json
{
  "id": "TM1",
  "template": "Hi {{FirstName}}, sorry we missed your call. Call Joe at +14153159430 re: 401K needs.",
  "description": "Default SMS message with click-to-call",
  "name": "SMS"
}
```

[More on Templates >](http://docs.cxengage.com/docs/templates/)

### Create a Template

Creates a template object for specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/templates
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the template
description | Description of the template
template | Template message which supports Mustache

> Example Request

```
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/templates \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"name": "My Template", "template": "Hello {{FirstName}}!"'
```

#### Returns

Returns a template object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "PT2",
  "name": "My Template",
  "template": "Hello {{FirstName}}!"
}
```

### Retrieve a Template

Retrieves the details of an existing template for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/templates/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Template ID

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/test123/templates/TM2 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a template object if specified tenant and template exist. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "TM2",
  "template": "Hi {{FirstName}}, sorry we missed your call. Call Joe at +14153159430 re: 401K needs.",
  "description": "Default SMS message with click-to-call",
  "name": "SMS"
}
```

### Update a Template

Updates an existing template of the specified tenant by setting the values of the provided parameters passed. Any parameters not provided will be unchanged. Your current authenticated user must have access to the specified tenant.

> Definition

```
PUT https://api.cxengage.net/1.0/tenants/{{tid}}/templates/{{id}}
```

#### Arguments

Name | Description
--- | ---
name | Human-friendly name of the template
description | Description of the template
template | Template message which supports Mustache

> Example Request

```
curl -X PUT https://api.cxengage.net/1.0/tenants/test144/templates/TM1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"name":"Test Template"}'
```

#### Returns

Returns the template object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
    "id": "TM5",
    "template": "Hi {{first-name}}. We apologize for the inconvenience. Please contact us at {{email-address}}",
    "description": "SMS apologizing to customer",
    "name": "Test Template"
}
```

### Delete a Template

Permanently deletes a template. It cannot be undone. Your current authenticated user must have access to the specified tenant.

> Definition

```
DELETE /1.0/tenants/{{tid}}/templates/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Template ID

> Example Request

```
curl -IX DELETE https://api.cxengage.net/1.0/tenants/tenant1/templates/TM1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Templates

Returns a list of all templates for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/templates
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/tenant1/templates \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an array containing all templates if the specified tenant exists. Returns [an
error](#errors) otherwise.

> Example Response

```json
[
  {
    "id": "TM1",
    "template": "Hi {{FirstName}}, sorry we missed your call. Call Joe at +14153159430 re: 401K needs.",
    "description": "Default SMS message with click-to-call",
    "name": "SMS"
  }
]
```

## Listeners

A listener allows you to integrate with a third-party service to receive events. For example, if you have a DataSift stream that monitors tweets for your company, you can connect this stream to CxEngage by creating a DataSift listener.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the listener
**description** | **string** | A people friendly description of what this listener should do
**status** | **boolean** | Whether or not it is currently listening for events
**type** | **enum** | The type of integration (`'salesforce'`, `'datasift'` or `'pusher'`)
**options** | **object** | An object containing all type specific details
**mapping** | **object** | An object re-mapping fields in the event to fields in the third-party event

> Example Object

```json
{
  "id": "LI1",
  "name": "Demo Datasift",
  "type": "datasift",
  "status": true,
  "options": {
    "hash": "xxxxxxxxxxxxxx"
  },
  "mapping": {
    "username": "interaction.author.username",
    "sentiment": "salience.content.sentiment",
    "id": "twitter.user.screen_name"
  }
}
```

[More on Listeners >](http://docs.cxengage.com/docs/using-listeners/)

### Create a Listener

Creates a listener object for specified tenant. The tenant must have access to the `type` of listener selected. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/listeners
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the listener
description | Description of the listener
status | Boolean for enabled/disabled state
**type** | The type of integration (`'salesforce'`, `'datasift'` or `'pusher'`)
**options** | An object containing all type specific details
**mapping** | An object re-mapping fields in the event to fields in the third-party event

> Example Request

```
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/listeners \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"name": "Demo Datasift",
          "type": "datasift",
          "status": true,
          "options": { "hash": "xxxxxxxxxxxxxx" },
          "mapping": { "username": "interaction.author.username",
                       "sentiment": "salience.content.sentiment",
                       "id": "twitter.user.screen_name" }}'
```

#### Returns

Returns a listener object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "LI2",
  "name": "Demo Datasift",
  "type": "datasift",
  "status": true
  "options": {
    "hash": "xxxxxxxxxxxxxx",
  },
  "mapping": {
    "username": "interaction.author.username",
    "sentiment": "salience.content.sentiment",
    "id": "twitter.user.screen_name"
  }
}
```

### Retrieve a Listener

Retrieves the details of an existing listener for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/listeners/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Listener ID

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/test123/listeners/LI2 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a listener object if specified tenant and listener exist. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "LI2",
  "name": "My Salesforce Listener",
  "status": true,
  "type": "salesforce",
  "options": {
    "version": "26.0",
    "topic": "CxDemo_0720v2"
  },
  "mapping": {
    "user": "user__c",
    "type": "Type",
    "stage": "StageName",
    "amount": "Amount",
    "daystoclose": "daysToClose__c",
    "product": "Product__c"
  }
}
```

### Update a Listener

Updates an existing listener of the specified tenant by setting the values of the provided parameters passed. Any parameters not provided will be unchanged. Your current authenticated user must have access to the specified tenant.

> Definition

```
PUT https://api.cxengage.net/1.0/tenants/{{tid}}/listeners/{{id}}
```

#### Arguments

Name | Description
--- | ---
name | Human-friendly name of the listener
description | Description of the listener
status | Boolean for enabled/disabled state
type | The type of integration ('salesforce', 'datasift' or 'pusher')
options | An object containing all type specific details
mapping | An object re-mapping fields in the event to fields in the third-party event

> Example Request

```
curl -X PUT https://api.cxengage.net/1.0/tenants/test144/listeners/LI1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"options": {"hash": "yyyyyyyyyy"}}'
```

#### Returns

Returns the listener object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "LI1",
  "name": "Demo Datasift",
  "type": "datasift",
  "status": true
  "options": {
    "hash": "yyyyyyyyyy"
  },
  "mapping": {
    "username": "interaction.author.username",
    "sentiment": "salience.content.sentiment",
    "id": "twitter.user.screen_name"
  }
}
```

### Delete a Listener

Permanantly deletes a listener. It cannot be undone. Immediately stops listening for new events. Your current authenticated user must have access to the specified tenant.

> Definition

```
DELETE /1.0/tenants/{{tid}}/listeners/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Listener ID

> Example Request

```
curl -IX DELETE https://api.cxengage.net/1.0/tenants/tenant1/listeners/LI1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Listeners

Returns a list of all listeners for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/listeners
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/tenant1/listeners \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an array containing all listeners if the specified tenant exists. Returns [an
error](#errors) otherwise.

> Example Response

```json
[
  {
    "id": "LI1",
    "name": "Demo Datasift",
    "type": "datasift",
    "status": true
    "options": {
      "hash": "yyyyyyyyyy"
    },
    "mapping": {
      "username": "interaction.author.username",
      "sentiment": "salience.content.sentiment",
      "id": "twitter.user.screen_name"
    }
  },
  {
    "id": "LI2",
    "name": "My Salesforce Listener",
    "status": true,
    "type": "salesforce",
    "options": {
      "version": "26.0",
      "topic": "CxDemo_0720v2"
    },
    "mapping": {
      "user": "user__c",
      "type": "Type",
      "stage": "StageName",
      "amount": "Amount",
      "daystoclose": "daysToClose__c",
      "product": "Product__c"
    }
  }
]
```

### Monitor a Listener

Retrieves the current status of an existing listener for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/listeners/{{id}}/status HTTP/1.1
```

#### Arguments

Name | Description
--- | ---
**id** | Listener ID

> Example Request

```
curl -XGET https://api.cxengage.net/1.0/tenants/tenant1/listeners/LI1/status \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a JSON object with attributes `status` and `message` when specified tenant and listener exist. Otherwise, returns [an error](#errors).

> Example Response

```json
{
    "status": "started",
    "message": "Connected to stream: hash"
}
```

## Integrations

Integrations are a convenient place to manage all of your third-party integrations credentials in one place. In order to be able to communicate with your services, we often require authentication keys. These integrations will apply for both the notifications and integrations, if that third-party system has both available.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**{{field}}** | **string** | Fields specific to each integration type

> Example Object

```json
{
  "id": "datasift",
  "api-key": "xxxxx",
  "username": "myuser"
}
```

[More on Integrations >](http://docs.cxengage.com/docs/integrations/)

### Setup Salesforce

Updates the Salesforce integration for specified tenant. The tenant must have access to the Salesforce integration. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/integrations/salesforce
```

#### Arguments

Name | Description
--- | ---
**secret-token** | Salesforce Secret Token
**username** | Salesforce Username
**password** | Salesforce Password
**consumer-key** | Salesforce Consumer Key
**consumer-secret** | Salesforce Consumer Secret

> Example Request

```
curl -XPOST https://api.cxengage.net/1.0/tenants/tenant1/integrations/salesforce \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"id": "salesforce", "type": "salesforce", "consumer-key": "consumerkey",
          "consumer-secret":"consumersecret","username":"email@userevents.com",
          "secret-token":"secret-token","password":"password"}'
```

#### Returns

Returns the integration object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "salesforce",
  "type": "salesforce",
  "consumer-key": "consumerkey",
  "consumer-secret": "consumersecret",
  "username": "email@userevents.com",
  "secret-token": "secret-token",
  "password": "password"
}
```

[More on Salesforce >](https://cxengage.zendesk.com/hc/en-us/articles/200788406-How-do-I-set-up-my-Salesforce-integration-)

### Setup Twilio

Updates the Twilio integration for specified tenant. The tenant must have access to the Twilio integration. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/integrations/twilio
```

#### Arguments

Name | Description
--- | ---
**account** | Twilio Account SID
**password** | Twilio Auth Token

> Example Request

```
curl -XPOST https://api.cxengage.net/1.0/tenants/tenant1/integrations/twilio \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"id": "twilio", "type": "twilio", "account": "SID", "password":"Token"}'
```

#### Returns

Returns the integration object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "twilio",
  "account": "SID",
  "password": "Token"
}
```

[More on Twilio >](https://cxengage.zendesk.com/hc/en-us/articles/200788416-How-do-I-set-up-my-Twilio-integration-)

### Setup Sendgrid

Updates the Sendgrid integration for specified tenant. The tenant must have access to the Sendgrid integration. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/integrations/sendgrid
```

#### Arguments

Name | Description
--- | ---
**account** | Sendgrid Account
**password** | Sendgrid Password

> Example Request

```
curl -XPOST https://api.cxengage.net/1.0/tenants/tenant1/integrations/sendgrid \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"id": "sendgrid", "type": "sendgrid", "account": "username", "password":"password"}'
```

#### Returns

Returns the integration object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "sendgrid",
  "account": "username",
  "password": "password"
}
```

[More on Sendgrid >](https://cxengage.zendesk.com/hc/en-us/articles/200788436-How-do-I-set-up-my-SendGrid-integration-)

### Setup Datasift

Updates the Datasift integration for specified tenant. The tenant must have access to the Datasift integration. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/integrations/datasift
```

#### Arguments

Name | Description
--- | ---
**username** | Datasift Username
**api-key** | Datasift API Key

> Example Request

```
curl -XPOST https://api.cxengage.net/1.0/tenants/tenant1/integrations/datasift \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"id": "datasift", "type": "datasift", "api-key": "api-key", "username":"username"}'
```

#### Returns

Returns the integration object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "datasift",
  "api-key": "api-key",
  "username": "username"
}
```

[More on Datasift >](https://cxengage.zendesk.com/hc/en-us/articles/200730157-How-do-I-set-up-my-DataSift-integration-)

### Setup Pusher

Updates the Pusher integration for specified tenant. The tenant must have access to the Pusher integration. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/integrations/pusher
```

#### Arguments

Name | Description
--- | ---
**key** | Pusher Consumer Key
**secret** | Pusher Consumer Secret

> Example Request

```
curl -XPOST https://api.cxengage.net/1.0/tenants/tenant1/integrations/pusher \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"id": "pusher", "type": "pusher", "key": "key", "secret":"password"}'
```

#### Returns

Returns the integration object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "pusher",
  "key": "key",
  "secret": "secret"
}
```

[More on Pusher >](https://cxengage.zendesk.com/hc/en-us/articles/200678188-How-do-I-set-up-my-Pusher-integration-)

### Retrieve an Integration

Retrieves the details of an existing integration for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/integrations/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Integration ID (salesforce, datasift, etc.)

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/test123/integrations/salesforce \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a integration object if specified tenant and integration exist. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "salesforce",
  "type": "salesforce",
  "consumer-key": "consumerkey",
  "consumer-secret": "consumersecret",
  "username": "dev@userevents.com",
  "secret-token": "secret-token",
  "password": "password"
}
```

### List All Integrations

Returns a list of all integrations for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/integrations
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/tenant1/integrations \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an array containing all integrations if the specified tenant exists. Returns [an
error](#errors) otherwise.

> Example Response

```json
[
  {
    "id": "datasift",
    "api-key": "keyvalue",
    "username": "usernamevalue"
  },
  {
    "id": "echo"
  }
]
```

## Augments

The purpose of augments are to allow you to add additional data to events that may be necessary in the context of matching a pattern or sending a notification but was not available at the time the event was sent to CxEngage.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**type** | **enum** | Type of augment (`'file'` or `'api'`)
**service** | **enum** | Service to augment before (`'engine'` or `'notification'`)

> Example Object

```json
{
  "id": "AU1",
  "name": "Augment CSV",
  "type": "file",
  "service": "engine"
}
```

[More on Augments >](http://docs.cxengage.com/docs/using-augments/)

### Creating an API Augment

Creates an API augment object for specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/augments
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the augment
description | Description of the augment
**type** | `'api'`
**service** | Service to augment before (`'engine'` or `'notification'`)
**options** | JSON Object with mandatory fields `'url'` and `'attributes'`
**url** | The API URL
**attributes** | An array of attributes to augment

> Example Request

```
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/augment \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"service": "engine", "name": "Augment API", "type": "api",
          "description": "REST API", "augment-service": "engine",
          "options": { "url": "hostname", "attributes": ["customerSegment"]}}'
```

#### Returns

Returns an augment object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "AU1",
  "service": "engine",
  "name": "Augment API",
  "description": "REST API",
  "augment-service": "engine",
  "type": "api",
  "options": {
    "url": "hostname",
    "attributes": [
      "customerSegment"
    ]
  }
}
```

### Creating a File Augment

Creates an File (CSV) augment object for specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/augments
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the augment
description | Description of the augment
**type** | `'file'`
**service** | Service to augment before (`'engine'` or `'notification'`)

> Example Request

```
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/augment \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"service": "engine", "name": "File Augment",
          "description": "CSV File", "type": "file"}'
```

#### Returns

Returns an augment object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "AU2",
  "name": "File Augment",
  "description": "CSV File",
  "type": "file",
  "service": "engine"
}
```

### Retrieve an Augment

Retrieves the details of an existing augment for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/augments/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Augment ID

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/tenant1/augments/AU2 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a augment object if specified tenant and augment exist. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "AU2",
  "name": "File Augment",
  "description": "CSV File",
  "type": "file",
  "service": "engine"
}
```

### Update an Augment

Updates an existing augment of the specified tenant by setting the values of the provided parameters passed. Any parameters not provided will be unchanged. Your current authenticated user must have access to the specified tenant.

> Definition

```
PUT https://api.cxengage.net/1.0/tenants/{{tid}}/augments/{{id}}
```

#### Arguments

Name | Description
--- | ---
name | Human-friendly name of the augment
description | Description of the augment
type | Type of Augment (`'file'` or `'api'`)
service | Service to augment before (`'engine'` or `'notification'`)
options | **API ONLY** JSON Object with mandatory fields `'url'` and `'attributes'`

> Example Request

```
curl -X PUT https://api.cxengage.net/1.0/tenants/tenant1/augments/AU1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"name": "My Augment"}'
```

#### Returns

Returns the augment object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "AU1",
  "service": "engine",
  "name": "My Augment",
  "description": "REST API",
  "augment-service": "engine",
  "type": "api",
  "options": {
    "url": "hostname",
    "attributes": [
      "customerSegment"
    ]
  }
}
```

### Delete an Augment

Permanantly deletes an augment. It cannot be undone. Immediately stops augmenting new events. Your current authenticated user must have access to the specified tenant.

> Definition

```
DELETE /1.0/tenants/{{tid}}/augments/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Augment ID

> Example Request

```
curl -IX DELETE https://api.cxengage.net/1.0/tenants/tenant1/augments/AU1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Augments

Returns a list of all augments for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/augments
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/tenant1/augments \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an array containing all augments if the specified tenant exists. Returns [an error](#errors) otherwise.

> Example Response

```json
[
  {
    "id": "AU1",
    "service": "engine",
    "name": "My Augment",
    "description": "REST API",
    "augment-service": "engine",
    "type": "api",
    "options": {
      "url": "hostname",
      "attributes": [
        "customerSegment"
      ]
    }
  },
  {
    "id": "AU2",
    "name": "File Augment",
    "description": "CSV File",
    "type": "file",
    "service": "engine"
  }
]
```

### Retrieve an Augment File

Retrieves an existing augment file for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
GET https://api.cxengage.net/1.0/tenants/{{tid}}/augments/{{id}}/file
```

#### Arguments

Name | Description
--- | ---
**id** | File Augment ID

> Example Request

```
curl -XGET https://api.cxengage.net/tenants/test123/augments/AU2/file \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a `text/csv` file if specified tenant and augment exist. Returns [an error](#errors) otherwise.

> Example Response

```
custId,first-name
101,Ryan
201,John
123,Bob
```

### Upload an Augment File

Upserts a CSV file for an existing File augment of the specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```
POST https://api.cxengage.net/1.0/tenants/{{tid}}/augments/{{id}}/file
```

#### Arguments

Name | Description
--- | ---
**id** | File Augment ID
**file** | CSV File to upload (as `form-data`)

> Example Request

```
curl -iX POST https://api.cxengage.net/1.0/tenants/tenant1/augments/AU2/file \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -F file=@users.csv
```

#### Returns

Returns an **HTTP 201** if successful. Otherwise, returns [an error](#errors).

### Delete an Augment File

Permanantly deletes an augment file. It cannot be undone. Immediately stops augmenting new events. Your current authenticated user must have access to the specified tenant.

> Definition

```
DELETE /1.0/tenants/{{tid}}/augments/{{id}}/file
```

#### Arguments

Name | Description
--- | ---
**id** | Augment ID

> Example Request

```
curl -IX DELETE https://api.cxengage.net/1.0/tenants/tenant1/augments/AU2/file \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).
