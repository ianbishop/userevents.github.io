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

## Tenants

### Retrieving a Tenant

Retrieve the details of a tenant which your authenticated user has access to.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request

```bash
curl -X GET https://api.cxengage.net/1.0/tenants/tenant1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a tenant object if a valid tenant is provided, returns [an error]() otherwise.

> Example Response

```json
{
    "id": "tenant1",
    "name": "Tenant One"
}
```

## Key Attribute

The key attribute is an attribute of your events to segment on. Often, it will be something like a unique customer identifier such as a customer number or a username.

#### Attributes

Name | Type | Description
--- | --- | ---
**key** | **string** | Key attribute

> Example Object

```json
{
  "key": "username"
}
```

[More About Key Attribute >](http://docs.cxengage.com/docs/key-attribute/)

### Retrieving the Key Attribute

Retrieve the key attribute of the specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}/key-attribute
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request
```bash
curl -X GET https://api.cxengage.net/1.0/tenants/tenant1/key-attribute \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a JSON object containing the key attribute of provided tenant if valid
tenant is provided. Returns [an error]() otherwise.

> Example Response

```json
{
    "key": "id"
}
```

### Update the Key Attribute

Updates the key attribute of the specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
POST https://api.cxengage.net/1.0/tenants/{{tid}}/key-attribute
```

#### Arguments

Name | Description
--- | ---
**key** | Key Attribute

> Example Request

```bash
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/key-attribute \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"key" : "username"}'
```

#### Returns

Returns a JSON object containing the key attribute if update succeeded. Returns
[an error]() if update parameters are invalid.

> Example Response

```json
{
    "key": "username"
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
**when** | **string** | CxEngage DSL of what pattern to look for
**then** | **string** | CxEngage DSL of how to react when matched

> Example Object

```json
{
  "name": "Sample Pattern",
  "description": "Sample",
  "status":true,
  "when": "(when (event (= id \"1234\")))",
  "then": "(seq (send echo message {:message \"Hello world\"}))"
}
```

[More About Patterns >]()

### Create a Pattern

Creates a pattern object for specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
POST https://api.cxengage.net/1.0/tenants/{{tid}}/patterns
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the pattern
description | Description of the pattern
status |  Boolean for enabled/disabled state
when | CxEngage DSL of what pattern to look for
then | CxEngage DSL of how to react when matched

> Example Request

```bash
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/patterns \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"then":"(send echo message {:message \"Hello curl\"})",
          "when":"(event (= type \"curl\"))","status":true,"name":"curl Pattern"}'
```

#### Returns

Returns a pattern object if successful, returns [an error]() otherwise. If `status` is set to true, the `when` and `then` fields must be provided and must be valid CxEngage DSL. If not, [an error]() will occur.

> Example Response

```json
{
  "id": "PT2",
  "name": "Sample Pattern",
  "description": "Sample",
  "status":true,
  "when": "(when (event (= \"id\" \"1234\")))",
  "then": "(seq (send echo message {:message \"Hello world\"}))"
}
```


#### Retrieve a Pattern

Retrieves the details of an existing pattern for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}/patterns/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Pattern ID

> Example Request

```bash
curl -XGET https://api.cxengage.net/tenants/test123/patterns/PT2 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a pattern object if specified tenant and pattern exist. Returns [an
error]() otherwise.

> Example Response

```json
{
  "id":"PT2",
  "when":"(when (event (= \"id\" \"1234\")))",
  "then":"(seq (send echo message {:message \"Hello world\"}))",
  "status":true,
  "description":"Sample Pattern",
  "name":"Sample Pattern"
}
```

### Update a Pattern

Updates an existing pattern of the specified tenant by settings the values of the provided parameters passed. Any parameters not provided will be unchanged. Your current authenticated user must have access to the specified tenant.

> Definition

```http
PUT https://api.cxengage.net/1.0/tenants/{{tid}}/patterns/{{id}}
```

#### Arguments

Name | Description
--- | ---
name | Human-friendly name of the pattern
description | Description of the pattern
status |  Boolean for enabled/disabled state
when | CxEngage DSL of what pattern to look for
then | CxEngage DSL of how to react when matched

> Example Request

```bash
curl -X PUT https://api.cxengage.net/1.0/tenants/test144/patterns/PT5 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"then" : "(send sendgrid email {:to *email*, :subject \"Welcome to a wonderful put experience\"})"}'
```

#### Returns

Returns the pattern object if the update succeeded, returns [an error]() otherwise.

> Example Response

```json
{
  "id":"PT5",
  "then":"(send sendgrid email {:to *email*, :subject \"Welcome to a wonderful put experience\"})",
  "when":"(event (or (= username \"cxengage\")))",
  "status":true,
  "name":"Updated Pattern"
}
```

### Delete a Pattern

Permanently deletes a pattern. It cannot be undone. Immediately stops matching events against the deleted pattern. Your current authenticated user must have access to the specified tenant.

> Definition

```http
DELETE /1.0/tenants/{{tid}}/patterns/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Pattern ID

> Example Request

```bash
curl -IX DELETE https://api.cxengage.net/1.0/tenants/tenant1/patterns/PT1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an **HTTP 201** if successful. Otherwise, returns [an error]().

### List All Patterns

Returns a list of all patterns for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}/patterns
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID


> Example Request

```bash
curl -XGET https://api.cxengage.net/tenants/tenant1/patterns \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an array containing all patterns if the specified tenant exists. Returns [an
error]() otherwise.

> Example Response

```json
[
  {
   "id": "PT1",
   "then": "(par (send echo message {:message \"We should probably call the customer\"})
                 (send echo message {:message \"We should probably call the customer now \"}))",
   "when": "(within 1 minutes (allOf (count 4 (event (and (= customerSegment \"Gold\")
                                                          (= eventType \"flcheck\"))))
                                              (event (and (= customerSegment \"Gold\")
                                                          (= eventType \"cnclTicket\"))))))",
   "description": "Loyalty Pattern for Gold customers",
   "name": "Loyalty Pattern"
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

[More About Templates >](http://docs.cxengage.com/docs/templates/)

### Create a Template

Creates a template object for specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
POST https://api.cxengage.net/1.0/tenants/{{tid}}/templates
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the template
description | Description of the template
template | Template message which supports Mustache

> Example Request

```bash
curl -X POST https://api.cxengage.net/1.0/tenants/tenant1/templates \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"name": "My Template", "template": "Hello {{FirstName}}!"'
```

#### Returns

Returns a template object if successful, returns [an error]() otherwise.

> Example Response

```json
{
  "id": "PT2",
  "name": "My Template",
  "when": "Hello {{FirstName}}!"
}
```

#### Retrieve a Template

Retrieves the details of an existing template for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}/templates/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Template ID

> Example Request

```bash
curl -XGET https://api.cxengage.net/tenants/test123/templates/TM2 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a template object if specified tenant and template exist. Returns [an
error]() otherwise.

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

Updates an existing template of the specified tenant by settings the values of the provided parameters passed. Any parameters not provided will be unchanged. Your current authenticated user must have access to the specified tenant.

> Definition

```http
PUT https://api.cxengage.net/1.0/tenants/{{tid}}/templates/{{id}}
```

#### Arguments

Name | Description
--- | ---
name | Human-friendly name of the template
description | Description of the template
template | Template message which supports Mustache

> Example Request

```bash
curl -X PUT https://api.cxengage.net/1.0/tenants/test144/templates/TM1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"name":"Test Template"}'
```

#### Returns

Returns the template object if the update succeeded, returns [an error]() otherwise.

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

```http
DELETE /1.0/tenants/{{tid}}/templates/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Template ID

> Example Request

```bash
curl -IX DELETE https://api.cxengage.net/1.0/tenants/tenant1/templates/TM1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an **HTTP 201** if successful. Otherwise, returns [an error]().

### List All Templates

Returns a list of all templates for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}/templates
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request

```bash
curl -XGET https://api.cxengage.net/tenants/tenant1/templates \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an array containing all templates if the specified tenant exists. Returns [an
error]() otherwise.

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
**type** | **enum** | The type of integration ('salesforce', 'datasift' or 'pusher')
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

[More About Listeners >](http://docs.cxengage.com/docs/using-listeners/)

### Create a Listener

Creates a listener object for specified tenant. The tenant must have access to the `type` of listener selected. Your current authenticated user must have access to the specified tenant.

> Definition

```http
POST https://api.cxengage.net/1.0/tenants/{{tid}}/listeners
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the listener
description | Description of the listener
status | Boolean for enabled/disabled state
**type** | The type of integration ('salesforce', 'datasift' or 'pusher')
**options** | An object containing all type specific details
**mapping** | An object re-mapping fields in the event to fields in the third-party event

> Example Request

```bash
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

Returns a listener object if successful, returns [an error]() otherwise.

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

#### Retrieve a Listener

Retrieves the details of an existing listener for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}/listeners/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Listener ID

> Example Request

```bash
curl -XGET https://api.cxengage.net/tenants/test123/listeners/LI2 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a listener object if specified tenant and listener exist. Returns [an error]() otherwise.

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

Updates an existing listener of the specified tenant by settings the values of the provided parameters passed. Any parameters not provided will be unchanged. Your current authenticated user must have access to the specified tenant.

> Definition

```http
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

```bash
curl -X PUT https://api.cxengage.net/1.0/tenants/test144/listeners/LI1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d '{"options": {"hash": "yyyyyyyyyy"}}'
```

#### Returns

Returns the listener object if the update succeeded, returns [an error]() otherwise.

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

```http
DELETE /1.0/tenants/{{tid}}/listeners/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Listener ID

> Example Request

```bash
curl -IX DELETE https://api.cxengage.net/1.0/tenants/tenant1/listeners/LI1 \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an **HTTP 201** if successful. Otherwise, returns [an error]().

### List All Listeners

Returns a list of all listeners for a specified tenant. Your current authenticated user must have access to the specified tenant.

> Definition

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}/listeners
```

#### Arguments

Name | Description
--- | ---
**tid** | Tenant ID

> Example Request

```bash
curl -XGET https://api.cxengage.net/tenants/tenant1/listeners \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns an array containing all listeners if the specified tenant exists. Returns [an
error]() otherwise.

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

```http
GET https://api.cxengage.net/1.0/tenants/{{tid}}/listeners/{{id}}/status HTTP/1.1
```

#### Arguments

Name | Description
--- | ---
**id** | Listener ID

> Example Request

```bash
curl -XGET https://api.cxengage.net/1.0/tenants/tenant1/listeners/LI1/status \
     -H 'Authorization: Bearer BQokikJOvBiI2HlWgH4olfQ2...'
```

#### Returns

Returns a JSON object with attributes `status` and `message` when specified tenant and listener exist. Otherwise, returns [an error]().

> Example Response

```json
{
    "status": "started",
    "message": "Connected to stream: hash"
}
```

## Integrations

**Retrieve integrations from tenant**

Request

```http
GET /1.0/tenants/{{tenant-name}}/integrations HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json
[
  {
    "id": "datasift",
    "api-key": "keyvalue",
    "username": "usernamevalue"
}

    {
        "id": "echo"
    }
]
```

curl Example

```bash
curl -XGET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations \
     -H 'Authorization: Bearer {{token}}'
```

**Create specific integrations**

__Salesforce Example__

Salesforce Parameters

secret-token
```
Salesforce secret token
```
username
```
Salesforce username
```
password
```
Salesforce password
```
consumer-key
```
Salesforce Consumer key/secret
```
consumer-secret
```
Salesforce Consumer key/secret
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/integrations/salesforce HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

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

Response

```json

{
    "id": "salesforce",
    "type": "salesforce",
    "consumer-key": "consumerkey",
    "consumer-secret": "consumersecret",
    "username": "email@userevents.com",
    "secret-token": "secret-token",
    "password": "password",

}
```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/salesforce \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "salesforce", "type": "salesforce", "consumer-key": "consumerkey",
     "consumer-secret":"consumersecret","username":"email@userevents.com"
     "secret-token":"secret-token","password":"password"}'

```

__Twilio Example__

Request

```http
POST /1.0/tenants/{{tenant-name}}/integrations/twilio HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

Twilio Parameters

account
```
Twilio SID
```
password
```
Twilio Token
```

```json
{
    "id": "twilio",
    "account": "SID",
    "password": "Token"
}

```

Response

```json

{
    "id": "twilio",
    "account": "SID",
    "password": "Token"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/twilio \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "twilio", "type": "twilio", "account": "SID", "password":"Token"}'
```

__Sendgrid Example__

Sendgrid Parameters

account
```
SendGrid account
```
password
```
Sendgrid password
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/integrations/sendgrid HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json
{
    "id": "sendgrid",
    "account": "username",
    "password": "password"
}

```

Response

```json

{
    "id": "sendgrid",
    "account": "username",
    "password": "password"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/sendgrid \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "sendgrid", "type": "sendgrid", "account": "username", "password":"password"}'

```

__Urban Airship Example__

Urban Airship Parameters

App Key
```
Urban Airship App Key
```
App Master Key
```
Urban Airship App Master Key
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/integrations/urban-airship HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json
{
    "id": "urban-airship",
    "username": "app key",
    "password": "app master key"
}

```

Response

```json

{
    "id": "urban-airship",
    "username": "app key",
    "password": "app master key"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/urban-airship \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "urban-airship", "type": "urban-airship", "username": "app key", "password":"app master key"}'

```

__Datasift Example__

Datasift Parameters

username
```
DataSift username
```
api-key

```
DataSift api key
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/datasift HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json
{
    "id": "datasift",
    "api-key": "api-key",
    "username": "username"
}

```

Response

```json

{
    "id": "datasift",
    "api-key": "api-key",
    "username": "username"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/datasift \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "datasift", "type": "datasift", "api-key": "api-key", "username":"username"}'

```

__Pusher Example__

Pusher Parameters
key
```
Pusher key
```
secret
```
Pusher secret
```

Request

```http
POST /1.0/tenants/{{tenant-name}}/pusher HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
```

```json
{
    "id": "pusher",
    "key": "key",
    "secret": "secret"
}

```

Response

```json

{
    "id": "pusher",
    "key": "key",
    "secret": "secret"
}

```

curl Example

```bash
curl -XPOST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/pusher \
     -H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json; charset=utf-8' \
-d '{"id": "pusher", "type": "pusher", "key": "key", "secret":"password"}'

```

**Retrieves specific integration from the given tenant**

Request

```http
GET /1.0/tenants/{{tenant-name}}/integrations/{{integration}} HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

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

curl Example

```bash
curl -XGET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/integrations/twilio \
     -H 'Authorization: Bearer {{token}}'
```

__Generic Streaming Endpoint__

Request a stream ticket

```
POST /1.0/tenants/<tenantid>/ticket HTTP/1.1
Host: stream.cxengage.net
Authorization: Bearer <token>
```

Open websocket connection with ticket

```
wss://stream.cxengage.net/1.0/stream/<ticket>
```

## Augments

**Retrieves augments for the given tenant**

Request

```http
GET /1.0/tenants/{{tenant-name}}/augments HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
```

```json
[
    {
        "id": "AU1",
        "name": "Augment csv",
        "type": "file",
        "service": "engine"
    },
    {
        "description": "Sample description",
        "id": "AU5",
        "name": "Augment csv",
        "type": "file",
        "service": "engine"
    }
]
```

curl Example

```bash
curl -X GET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augments \
     -H 'Authorization: Bearer {{token}}'
```

**Create an Augment for a tenant**

**Mandatory Parameters**

name
```
Name of Augment
```

type
```
file or api based augment
```
service
```
engine or notification
```

**Optional Parameters**

options
```
Map of optional attributes shown below
```
url
```
url of the augment api
```
attributes
```
Attributes that would get augmented
```

Request

```
POST /1.0/tenants/{{tenant-name}}/augments HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

```json
{
    "service": "engine",
    "name": "rest augment api",
    "description": "description",
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

Response

```json
{
    "service": "engine",
    "id": "AU2",
    "name": "rest augment api",
    "description": "description",
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

curl Example

```bash
curl -X POST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augment \
 -H 'Authorization: Bearer {{token}}' \
 -H 'Content-Type: application/json; charset=utf-8' \
 -d '{"service": "engine", "id": "AU2", "name": "rest augment api",
      "description": "describe", "augment-service": "engine", "type": "api",
      "options": { "url": "hostname", "attributes": ["customerSegment"]}}'
```

**File based augment**

Request

```
POST /1.0/tenants/{{tenant-name}}/augments HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json; charset=utf-8
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

```json
{
    "service": "engine",
    "name": "rest augment api",
    "description": "description",
    "augment-service": "engine",
    "type": "file",
    "options": {
        "attributes": [
            "customerSegment", "twitter"
        ]
    }
}
```

Response

```json
{
    "service": "engine",
    "id": "AU2",
    "name": "rest augment api",
    "description": "description",
    "augment-service": "engine",
    "type": "file",
    "options": {
        "url": "hostname",
        "attributes": [
            "customerSegment"
        ]
    }
}
```

curl Example

```bash
curl -X POST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augment \
 -H 'Authorization: Bearer {{token}}' \
 -H 'Content-Type: application/json; charset=utf-8' \
 -d '{"service": "engine","id": "AU2","name": "rest augment api",
      "description": "","augment-service": "engine","type":
      "file","options": {"attributes": ["customerSegment", "twitter"]}}'
```

**Upload CSV for Augment**

**Upload File**

Request

```
POST /1.0/tenants/{{tenant-name}}/augments/AU1/file HTTP/1.1
Host: api.cxengage.net
Authorization: Bearer {{token}}
Cache-Control: no-cache

----WebKitFormBoundaryE19zNvXGzXaLvS5C
Content-Disposition: form-data; name="file"; filename="1.csv"
Content-Type: text/csv

----WebKitFormBoundaryE19zNvXGzXaLvS5C
```

curl Example

```bash
curl -iX POST https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augments/AU14/file \
-H 'Authorization: Bearer Mc6NLc7ukAE3AR59XDqRbOxvVW1RTaoYHeLQm9P2WhlX' \
-F file=@1.csv
```

**Retrieves augment for the given tenant**

Request

```http
GET /1.0/tenants/{{tenant-name}}/augments/{{augment-id}} HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
Cache-Control: no-cache
```

Response

```json
{
    "id": "AU1",
    "name": "API based",
    "service": "engine",
    "type": "api",
    "options": {
        "url": "http://cxengage-augment",
        "attributes": [
            "phoneNumber",
            "customerSegment"
        ]
    }
}
```

curl Example

```bash
curl -X GET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augments/AU1 \
     -H 'Authorization: Bearer {{token}}'

```

**Retrieve augment CSV**

Request

```http
GET /1.0/tenants/{{tenant-name}}/augments/AU1/file HTTP/1.1
Host: api.cxengage.net
Content-Type: application/json
Authorization: Bearer {{token}}
```

Response

```
custId,first-name
101,Ryan
201,John
123,Bob
```

curl Example

```bash
curl -X GET https://api.cxengage.net/1.0/tenants/{{tenant-name}}/augments/AU1/file \
     -H 'Authorization: Bearer {{token}}'
```
