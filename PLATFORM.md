# API

The Platform API allows you to administrate your CxEngage platform.

If you're looking to manage your services, create new tenants or users then this
API is built for you.

## Authentication

CxEngage Platform API has no authentication. It should be placed in a network
configuration that allows only privileged local network users to access it.

## Errors

CxEngage Platform API uses standard HTTP response codes for errors.

Code | Description
-- | --
**200 OK** | Everything worked as expected
**201 Created** | Your item was successfully created
**204 No Content** | Your item was successfully deleted
**400 Bad Request** | Missing a required parameters
**404 Not Found** | The requested tenant or item does not exist
**500 Server Error** | Something bad happened on our end, please contact support

All responses are accommodated with a human-readable `error` field in a JSON
object to ease debugging.

## Versioning

We version our API to protect you from backward-incompatible changes.

Version | Endpoint
-- | --
**1.0** |

# Platform Management

## Instances

An instance describes a single physical collection of CxEngage services. An
instance can serve multiple tenants, virtual partitions on top of the services.
As an administrator, you can create many instances as required and assign
tenants to a single instance.

#### Attributes

Name | Type | Description
-- | -- | --
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the instance
**auth** | **string** | URL of the Authentication Service
**api** | **string** | URL of the CxEngage REST API
**events** | **string** | URL of the REST Receiver
**zk** | **string** | URL of Zookeeper Cluster *(comma separated)*
**redis** | **string** | URL of Redis
**stats** | **object** | JSON Object with stats configuration

> Example Object

```json
{
  "id": "IN1",
  "name": "My Instance",
  "auth": "http://localhost:8082",
  "api": "http://localhost:8081",
  "events": "http://localhost:8083",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379",
  "stats": {
    "type": "graphite",
    "url": "localhost",
    "port": 2003,
    "prefix": "development"
  }
}
```

[More on Instances >](http://docs.cxengage.com/docs/platform/instances/)

### Create an Instance

Creates an instance object.

> Definition

```
POST /1.0/instances
```
#### Arguments

Name | Description
-- | --
**name** | Human-friendly name of the instance
**zk** | URL of Zookeeper Cluster *(comma separated)*
**redis** | URL of Redis
auth | URL of the Authentication Service
api | URL of the CxEngage REST API
events | URL of the REST Receiver
stats | JSON Object with stats configuration

> Example Request

```
curl -X POST /1.0/instances \
     -H 'Content-Type: application/json' \
     -d '{"name": "My Instance", "zk": "localhost:2181",
          "redis": "redis://localhost:6379"}'
```

#### Returns

Returns an instance object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "IN2",
  "name": "My Instance",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379"
}
```

### Retrieve an Instance

Retrieves the details of an existing instance.

> Definition

```
GET /1.0/instances/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -XGET /1.0/instances/IN2
```

#### Returns

Returns an instance object if specified instance exists. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "IN2",
  "name": "My Instance",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379"
}
```

### Update an Instance

Updates an existing instance by setting the values of the provided parameters passed. Any parameters not provided will be unchanged.

> Definition

```
PUT /1.0/instances/IN2
```

#### Arguments

Name | Description
-- | --
name | Human-friendly name of the instance
zk | URL of Zookeeper Cluster *(comma separated)*
redis | URL of Redis
auth | URL of the Authentication Service
api | URL of the CxEngage REST API
events | URL of the REST Receiver
stats | JSON Object with stats configuration

> Example Request

```
curl -X PUT /1.0/instances/IN2 \
     -H 'Content-Type: application/json' \
     -d '{"name": "Production Instance"}'
```

#### Returns

Returns the instance object if the update succeeded, returns [an error](#errors)
otherwise.

> Example Response

```json
{
  "id": "IN2",
  "name": "Production Instance",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379"
}
```

### Delete an Instance

Permanently deletes an instance. It cannot be undone. Immediately stops all services. Your current authenticated user must have access to the specified tenant.

> Definition

```
DELETE /1.0/instances/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -IX DELETE /1.0/instances/IN2
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Instances

Returns a list of all instances.

> Definition

```
GET /1.0/instances
```

#### Arguments

None.

> Example Request

```
curl -XGET /1.0/instances
```

#### Returns

Returns an array containing all instances.

> Example Response

```json
[
  {
    "id": "IN1",
    "name": "Root Instance",
    "zk": "localhost:2180",
    "redis": "redis://localhost:6378"
  },
  {
    "id": "IN2",
    "name": "Production Instance",
    "zk": "localhost:2181",
    "redis": "redis://localhost:6379"
  }
]
```

### List Tenants of an Instance

Returns a list of all tenants for a specified instance.

> Definition

```
GET /1.0/instances/{{id}}/tenants
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -XGET /1.0/instances/IN2/tenants
```

#### Returns

Returns an array containing all tenants if the specified instance exists.
Returns [an error](#errors) otherwise.

```json
[
  {
    "id": "system",
    "name": "My Tenant"
  },
  {
    "id": "tenant1",
    "name": "My Other Tenant"
  }
]
```

## Tenants

A tenant describes a virtual partition of a CxEngage instance. A tenant may be
provided for each client-organization. A user of CxEngage may have access to
multiple tenants across many instances.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the pattern
**rate-limit** | **number** | Rate Limit of Events per second

> Example Object

```json
{
  "id": "tenant1",
  "name": "My Tenant"
}
```

[More on Tenants >](http://docs.cxengage.com/docs/platform/tenants/)

### Create a Tenant

Creates a tenant object.

> Definition

```
POST /1.0/tenants
```

#### Arguments

Name | Description
-- | --
**id** | Unique identifier
**name** | Human-friendly name of the instance
rate-limit | Rate Limit of Events per second

> Example Request

```
curl -X POST /1.0/tenants \
     -H 'Content-Type: application/json' \
     -d '{"id": "tenant1", "name": "My Tenant"}'
```

#### Returns

Returns a tenant object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "tenant1",
  "name": "My Tenant"
}
```

### Retrieve a Tenant

Retrieves the details of an existing tenant.

> Definition

```
GET /1.0/tenants/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -XGET /1.0/tenant/tenant1
```

#### Returns

Returns a tenant object if specified tenant exists. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "tenant1",
  "name": "My Tenant"
}
```

### Update a Tenant

Updates an existing tenant by setting the values of the provided parameters passed. Any parameters not provided will be unchanged.

> Definition

```
PUT /1.0/tenants/{{id}}
```

#### Arguments

Name | Description
-- | --
name | Human-friendly name of the instance
rate-limit | Rate Limit of Events per second

> Example Request

```
curl -X PUT /1.0/tenants/tenant1 \
     -H 'Content-Type: application/json' \
     -d '{"name": "Test Tenant"}'
```

#### Returns

Returns the tenant object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "tenant1",
  "name": "Test Tenant"
}
```

### Delete a Tenant

Permanently deletes a tenant. It cannot be undone. Immediately stops processing events for this tenant.

> Definition

```
DELETE /1.0/tenants/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -IX DELETE /1.0/tenants/tenant1
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Tenants

Returns a list of all tenants.

> Definition

```
GET /1.0/tenants
```

#### Arguments

None.

> Example Request

```
curl -XGET /1.0/tenants
```

#### Returns

Returns an array containing all tenants.

> Example Response

```json
[
  {
    "id": "tenant1",
    "name": "Test Tenant",
  },
  {
    "id": "system",
    "name": "Main Tenant",
  }
]
```

### List Users of a Tenant

Returns a list of all users for a specified tenant.

> Definition

```
GET /1.0/tenants/{{id}}/users
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -XGET /1.0/tenants/tenant1/users
```

#### Returns

Returns an array containing all users if the specified tenant exists.
Returns [an error](#errors) otherwise.

```json
[
  "ian@userevents.com",
  "admin@userevents.com"
]
```

### Retrieve Instance of a Tenant

Retrieves the details of the current instance of an existing tenant.

> Definition

```
GET /1.0/tenants/{{id}}/instance
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -XGET /1.0/tenant/tenant1/instance
```

#### Returns

Retrieves the instance object if specified tenant exists and has a current
instance. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "IN2",
  "name": "My Instance",
  "zk": "localhost:2181",
  "redis": "redis://localhost:6379"
}
```

### Add Tenant to Instance

Adds a tenant to an instance. This will upsert any existing instance. Any
existing state related to this tenant on the original instance will be lost.

> Definition

```
POST /1.0/tenants/{{tid}}/instance
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -X POST /1.0/tenants/tenant1/instance \
     -H 'Content-Type: application/json' \
     -d '{"id": "IN2"}'
```

#### Returns

Returns a JSON Object with keys `instance` and `tenant` if successful, returns
[an error](#error) otherwise.

> Example Response

```json
{
  "tenant": "tenant1",
  "instance": "IN2"
}
```

### Remove Tenant from Instance

Removes a tenant from an instance. This will remove any existing state on the
instance for this tenant.

> Definition

```
DELETE /1.0/tenants/{{id}}/instance
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -IX DELETE /1.0/tenants/tenant1/instance
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### Add Integration to Tenant

Gives a tenant access to the specified integration. This enables the tenant to
use a related endpoint or listener of this integration.

> Definition

```
POST /1.0/tenants/{{tid}}/integrations/{{id}}
```
#### Arguments

Name | Description
--- | ---
**id** | Integration ID

> Example Request

```
curl -X POST /1.0/tenants/tenant1/integrations/datasift
```

#### Returns

Returns an **HTTP 201** if tenant and integration exist. Otherwise, returns [an
error](#errors).

### Remove Integration from Tenant

Removes access of a tenant to the specified integration. This will disable any related listeners and possibly break patterns of that tenant.

> Definition

```
DELETE /1.0/tenants/{{tid}}/integrations/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Integration ID

> Example Request

```
curl -IX DELETE /1.0/tenants/tenant1/integrations/datasift
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Integrations of a Tenant

Returns a list of all active integrations for a specified tenant.

> Definition

```
GET /1.0/tenants/{{id}}/integrations
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -XGET /1.0/tenants/tenant1/integrations
```

#### Returns

Returns an array containing all active integrations if the specified tenant exists.
Returns [an error](#errors) otherwise.

> Example Response

```json
[
  "salesforce",
  "datasift",
  "echo"
]
```

## Users

A user in CxEngage may be associated with many tenants. A user may submit events or modify any tenant they have been access to.

#### Attributes

Name | Type | Description
--- | --- | ---
**email** | **string** | Email of the user
**name** | **string** | Name of the user
**client-id** | **string** | Client ID Credential
**tenants** | **array** | List of accessible tenants

> Example Object

```json
{
    "email": "ian.bishop@userevents.com",
    "name": "Ian Bishop",
    "client-id": "Dk5w6yi5mOfN+HRcwDmxEN...",
    "tenants": [
        "userevents"
    ]
}
```

[More on Users >](http://docs.cxengage.com/docs/platform/users/)

### Create a User

Creates a user object.

> Definition

```
POST /1.0/users
```

#### Arguments

Name | Type | Description
--- | --- | ---
**email** | Email of the user
**name** | Name of the user
**password** | Password for user
tenants | Array of accessible tenants

> Example Request

```
curl -X POST /1.0/users \
     -H 'Content-Type: application/json' \
     -d '{"email": "ian@userevents.com", "name": "Ian Bishop",
          "password": "butter", "tenants": ["userevents"]}'
```

#### Returns

Returns a user object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
    "email": "ian@userevents.com",
    "name": "Ian Bishop",
    "client-id": "xxxxxx",
    "tenants": [
        "userevents"
    ]
}
```

### Retrieve a User

Retrieves the details of an existing user.

> Definition

```
GET /1.0/users/{{email}}
```

#### Arguments

Name | Description
--- | ---
**email** | User Email

> Example Request

```
curl -XGET /1.0/users/ian@userevents.com
```

#### Returns

Returns a user object if specified user exists. Returns [an error](#errors) otherwise.

> Example Response

```json
{
    "email": "ian@userevents.com",
    "name": "Ian Bishop",
    "client-id": "xxxxxx",
    "tenants": [
        "userevents"
    ]
}
```

### Update a User

Updates an existing user by setting the values of the provided parameters
passed. Any parameters not provided will be unchanged.

> Definition

```
PUT /1.0/users/{{email}}
```

#### Arguments

Name | Type | Description
--- | --- | ---
name | Name of the user
tenants | Array of accessible tenants

> Example Request

```
curl -X PUT /1.0/users/ian@userevents.com \
     -H 'Content-Type: application/json' \
     -d '{"name": "John Smith"}'
```

#### Returns

Returns the user object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
    "email": "ian@userevents.com",
    "name": "John Smith",
    "client-id": "xxxxxx",
    "tenants": [
        "userevents"
    ]
}
```

### Delete a User

Permanently deletes a user. It cannot be undone. Immediately stops user from being able to access any authenticated resources with its credentials.

> Definition

```
DELETE /1.0/users/{{email}}
```

#### Arguments

Name | Description
--- | ---
**email** | User Email

> Example Request

```
curl -IX DELETE /1.0/users/ian@userevents.com
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Users

Returns a list of all users.

> Definition

```
GET /1.0/users
```

#### Arguments

None.

> Example Request

```
curl -XGET /1.0/users
```

#### Returns

Returns an array containing all users.

```json
[
  {
    "email": "ian@userevents.com",
    "name": "Ian Bishop",
    "client-id": "xxxxxx",
    "tenants": [
        "userevents"
    ]
  },
  {
    "email": "josh@userevents.com",
    "name": "Josh Comer",
    "client-id": "yyyyyy",
    "tenants": [
        "userevents"
    ]
  }
]
```

### Add User to Tenant

Adds a user to a tenant. This gives the user permission to submit events and modify the tenant.

> Definition

```
POST /1.0/users/{{email}}/tenants/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -X POST /1.0/users/ian@userevents.com/tenants/userevents
```

#### Returns

Returns an **HTTP 201** if user and tenant exist. Otherwise, returns [an error](#errors).

### Remove User from Tenant

Removes access of a user to the specified tenant. Immediately stops user from being able to access the tenant with its credentials.

> Definition

```
DELETE /1.0/users/{{email}}/tenants/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Tenant ID

> Example Request

```
curl -IX DELETE /1.0/users/ian@userevents.com/tenants/userevents
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

# Service Management

## Nodes

A node represents a physical machine on which CxEngage services are deployed.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the node
**description** | **string** | A people friendly description of what this node should do
**status** | **boolean** | Whether or not this node can be deployed against
**ip-address** | **string** | IP Address of the machine
**username** | **string** | Name of the CxEngage user
**password** | **string** | Password for the CxEngage user

> Example Object

```json
{
  "id": "ND1",
  "name": "Dev CxEngage API",
  "ip-address": "127.0.0.1",
  "username": "cxengage",
  "password": "password",
  "status": true
}
```

[More on Nodes >](http://docs.cxengage.com/docs/platform/nodes/)

### Create a Node

Creates a node object for the specified instance.

> Definition

```
POST /1.0/instances/{{iid}}/nodes
```

#### Arguments

Name |  Description
--- | ---
**name** | Human-friendly name of the node
**ip-address** | IP Address of the machine
**username** | Name of the CxEngage user
**password** | Password for the CxEngage user
description | A people friendly description of what this node should do
status | Whether or not this node can be deployed against

> Example Request

```
curl -X POST /1.0/instances/IN1/nodes \
     -H 'Content-Type: application/json' \
     -d '{"name": "local box", "ip-address": "127.0.0.1",
          "username": "cxengage", "password": "butter"}'
```

#### Returns

Returns a node object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "ND2",
  "name": "local box",
  "ip-address": "127.0.0.1",
  "username": "cxengage",
  "password": "butter"
}
```

### Retrieve a Node

Retrieves the details of an existing node for specified instance.

> Definition

```
GET /1.0/instances/{{iid}}/nodes/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Node ID

> Example Request

```
curl -XGET /1.0/instances/IN1/nodes/ND1
```

#### Returns

Returns a node object if specified instance and node exists. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "ND1",
  "name": "Dev CxEngage API",
  "ip-address": "127.0.0.1",
  "username": "cxengage",
  "password": "password",
  "status": true
}
```

### Update a Node

Updates an existing node for specified instance by setting the values of the provided parameters passed. Any parameters not provided will be unchanged.

> Definition

```
PUT /1.0/instances/{{iid}}/nodes/{{id}}
```

#### Arguments

Name |  Description
--- | ---
name | Human-friendly name of the node
description | A people friendly description of what this node should do
status | Whether or not this node can be deployed against
ip-address | IP Address of the machine
username | Name of the CxEngage user
password | Password for the CxEngage user

> Example Request

```
curl -X PUT /1.0/instances/IN1/nodes/ND2 \
     -H 'Content-Type: application/json' \
     -d '{"name": "local box 2"}'
```

#### Returns

Returns the node object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "ND2",
  "name": "local box 2",
  "ip-address": "127.0.0.1",
  "username": "cxengage",
  "password": "butter"
}
```

### Delete a Node

Permanently deletes a node for specified instance. It cannot be undone. Immediately stops services from being deployed to this node.

> Definition

```
DELETE /1.0/instances/{{iid}}/nodes/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Node ID

> Example Request

```
curl -IX DELETE /1.0/instances/IN1/nodes/ND1
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Nodes

Returns a list of all nodes for specified instance.

> Definition

```
GET /1.0/instances/{{id}}/nodes
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -XGET /1.0/instances/IN1/nodes
```

#### Returns

Returns an array containing all nodes if specified instance exists. Otherwise,
returns [an error](#errors).

> Example Response

```json
[
  {
    "id": "ND1",
    "name": "Dev CxEngage API",
    "ip-address": "127.0.0.1",
    "username": "cxengage",
    "password": "password",
    "status": true
  },
  {
    "id": "ND2",
    "name": "local box",
    "ip-address": "127.0.0.1",
    "username": "cxengage",
    "password": "butter"
  }
]
```

### Ping a Node

Verifies that the credentials of a node for a specified instance can be successfully connected to by SSH.

> Definition

```
POST /1.0/instances/{{iid}}/nodes/{{id}}/ping
```

#### Arguments

Name | Description
--- | ---
**id** | Node ID

> Example Request

```
curl -X POST /1.0/instances/IN1/nodes/ND2/ping
```

#### Returns

Returns a JSON object with key `result` indicating its availability if specified
node and instance exist. Otherwise, returns [an error](#errors).

> Example Response

```json
{
  "result": true
}
```

## Services

A service represents a single component in the CxEngage architecture. It
describes not the actual running software but the configurations of all
processes of that type.

#### Attributes

Name | Type | Description
--- | --- | ---
**id** | **string** | Unique identifier
**name** | **string** | Human-friendly name of the node
**description** | **string** | A people friendly description of what this node should do
**type** | **string** | Type of service
**log-level** | **enum** | Log-level of service (`trace`, `info`, `debug`,
`warning` or `error`)
**options** | **object** | Service type specific configuration options

> Example Object

```json
{
  "id": "SV1",
  "type": "auth",
  "name": "Auth",
  "log-level": "trace",
  "options": {
    "port": 8082,
    "token-ttl": 2592000
  }
}
```

[More on Services >](http://docs.cxengage.com/docs/platform/services/)

### Create a Service

Creates a service object for the specified instance.

> Definition

```
POST /1.0/instances/{{id}}/services
```

#### Arguments

Name | Description
--- | ---
**name** | Human-friendly name of the node
**type** | Type of service
description | A people friendly description of what this node should do
log-level | Log-level of service (`trace`, `info`, `debug`,
`warning` or `error`)
options | Service type specific configuration options

> Example Request

```
curl -X POST /1.0/instances/IN1/services \
     -H 'Content-Type: application/json' \
     -d '{"name": "WebApp", "type": "webapp", "log-level": "error",
          "options": { "port": 8888 }}'
```

#### Returns

Returns a service object if successful, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "SV2",
  "type": "webapp",
  "name": "WebApp",
  "log-level": "error",
  "options": {
    "port": 8888,
  }
}
```

### Retrieve a Service

Retrieves the details of an existing service for specified instance.

> Definition

```
GET /1.0/instances/{{iid}}/services/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Service ID

> Example Request

```
curl -XGET /1.0/instances/IN1/services/SV1
```

#### Returns

Returns a service object if specified instance and service exists. Returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "SV1",
  "type": "auth",
  "name": "Auth",
  "log-level": "trace",
  "options": {
    "port": 8082,
    "token-ttl": 2592000
  }
}
```

### Update a Service

Updates an existing service for specified instance by setting the values of the provided parameters passed. Any parameters not provided will be unchanged.

> Definition

```
PUT /1.0/instances/{{iid}}/services/{{id}}
```

#### Arguments

Name | Description
--- | ---
name | Human-friendly name of the node
type | Type of service
description | A people friendly description of what this node should do
log-level | Log-level of service (`trace`, `info`, `debug`,
`warning` or `error`)
options | Service type specific configuration options

> Example Request

```
curl -X PUT /1.0/instances/IN1/services/SV2 \
     -H 'Content-Type: application/json' \
     -d '{"name": "WebApp Dev"}'
```

#### Returns

Returns the service object if the update succeeded, returns [an error](#errors) otherwise.

> Example Response

```json
{
  "id": "SV2",
  "type": "webapp",
  "name": "WebApp Dev",
  "log-level": "error",
  "options": {
    "port": 8888,
  }
}
```

### Delete a Service

Permanently deletes a service for specified instance. It cannot be undone. Immediately removes any processes of this service.

> Definition

```
DELETE /1.0/instances/{{iid}}/services/{{id}}
```

#### Arguments

Name | Description
--- | ---
**id** | Service ID

> Example Request

```
curl -IX DELETE /1.0/instances/IN1/services/ND1
```

#### Returns

Returns an **HTTP 204** if successful. Otherwise, returns [an error](#errors).

### List All Services

Returns a list of all services for specified instance.

> Definition

```
GET /1.0/instances/{{id}}/services
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -XGET /1.0/instances/IN1/services
```

#### Returns

Returns an array containing all services if specified instance exists. Otherwise, returns [an error](#errors).

> Example Response

```json
[
  {
    "id": "SV1",
    "type": "auth",
    "name": "Auth",
    "log-level": "trace",
    "options": {
      "port": 8082,
      "token-ttl": 2592000
    }
  },
  {
    "id": "SV2",
    "type": "webapp",
    "name": "WebApp",
    "log-level": "error",
    "options": {
      "port": 8888,
    }
  }
]
```

### Start a Service

Starts all processes of a service for a specified instance.

> Definition

```
POST /1.0/instances/{{iid}}/services/{{id}}/start
```

#### Arguments

Name | Description
--- | ---
**id** | Service ID

> Example Request

```
curl -X POST /1.0/instances/IN1/services/SV1/start
```

#### Returns

Returns a JSON object with keys `running` indicating the current status of the service and  `processes` an array of the current status for each process. Otherwise, returns [an error](#errors).

> Example Response

```json
{
  "id": "SV1",
  "running": true,
  "processes": [
    {
        "id": "bc975bd6-70a5-4d67-af00-1d6dffdfdba0",
        "running": true
    }
  ]
}
```

### Stop a Service

Stops all processes of a service for a specified instance.

> Definition

```
POST /1.0/instances/{{iid}}/services/{{id}}/stop
```

#### Arguments

Name | Description
--- | ---
**id** | Service ID

> Example Request

```
curl -X POST /1.0/instances/IN1/services/SV1/stop
```

#### Returns

Returns a JSON object with keys `running` indicating the current status of the service and  `processes` an array of the current status for each process. Otherwise, returns [an error](#errors).

> Example Response

```json
{
  "id": "SV1",
  "running": false,
  "processes": [
    {
      "id": "bc975bd6-70a5-4d67-af00-1d6dffdfdba0",
      "running": false
    }
  ]
}
```

### Monitor a Service

Retrieve the running status of a service for a specified instance.

> Definition

```
GET /1.0/instances/{{iid}}/services/{{id}}/status
```

#### Arguments

Name | Description
--- | ---
**id** | Service ID

> Example Request

```
curl -X GET /1.0/instances/IN1/services/SV1/status
```

#### Returns

Returns a JSON object with key `running` indicating if the service is currently
running. Otherwise, returns [an error](#errors).

> Example Response

```json
{
  "running": true
}
```

### List All Processes

Returns a list of all processes for a service of a specified instance.

> Definition

```
GET /1.0/instances/{{iid}}/services/{{id}}/processes
```

#### Arguments

Name | Description
--- | ---
**id** | Service ID

> Example Request

```
curl -XGET /1.0/instances/IN1/services/SV1/processes
```

#### Returns

Returns an array containing all processes if service and specified instance exist. Otherwise, returns [an error](#errors).

> Example Response

```json
[
  {
    "id": "bc975bd6-70a5-4d67-af00-1d6dffdfdba0",
    "instance": "IN1",
    "node": "ND1",
    "service": "SV1"
  }
]
```

### Start All Services

Starts all services of a specified instance.

> Definition

```
POST /1.0/instances/{{id}}/services/start
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -X POST /1.0/instances/IN1/services/start
```

#### Returns

Returns an array with JSON objects containing the result of each service. Otherwise, returns [an error](#errors).

> Example Response

```json
[
  {
    "id": "SV3",
    "running": true,
    "processes": [
      {
        "id": "77f19fc7-e10a-4732-8789-38613a95185e",
        "running": true
      }
    ]
  },
  {
    "id": "SV2",
    "running": true,
    "processes": [
      {
        "id": "bc975bd6-70a5-4d67-af00-1d6dffdfdba0",
        "running": true
      }
    ]
  },
  {
    "id": "SV1",
    "running": true,
    "processes": [
      {
        "id": "c220e9a8-3ce5-4981-8b28-44e30a25d52e",
        "running": true
      }
    ]
  }
]
```

### Stop All Services

Stops all services of a specified instance.

> Definition

```
POST /1.0/instances/{{id}}/services/stop
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -X POST /1.0/instances/IN1/services/stop
```

#### Returns

Returns an array with JSON objects containing the result of each service. Otherwise, returns [an error](#errors).

> Example Response

```json
[
  {
    "id": "SV3",
    "running": false,
    "processes": [
      {
        "id": "77f19fc7-e10a-4732-8789-38613a95185e",
        "running": false
      }
    ]
  },
  {
    "id": "SV2",
    "running": false,
    "processes": [
      {
        "id": "bc975bd6-70a5-4d67-af00-1d6dffdfdba0",
        "running": false
      }
    ]
  },
  {
    "id": "SV1",
    "running": false,
    "processes": [
      {
        "id": "c220e9a8-3ce5-4981-8b28-44e30a25d52e",
        "running": false
      }
    ]
  }
]

```

### Monitor All Services

Retrieves the running status of all services of a specified instance.

> Definition

```
GET /1.0/instances/{{id}}/services/status
```

#### Arguments

Name | Description
--- | ---
**id** | Instance ID

> Example Request

```
curl -X GET /1.0/instances/IN1/services/status
```

#### Returns

Returns an array of JSON objects with key `running` indicating if the service is currently running. Otherwise, returns [an error](#errors).

```json
[
  {
    "id": "SV3",
    "running": true
  },
  {
    "id": "SV2",
    "running": true
  },
  {
    "id": "SV1",
    "running": true
  }
]
```

## Processes

### Create a Process

### Retrieve a Process

### Delete a Process

### List All Processes

### Start a Process

### Stop a Process

### Monitor a Process
