# API

The Platform API allows you to administrate your CxEngage platform.

If you're looking to manage your services, create new tenants or users then this
API is built for you.

## Authentication

CxEngage Platform API has no authentication. It should be placed in a network
configuration that allows only privileged local network users to access it.

The Platform API does not need to be running for CxEngage to run. It is
suggested to shutdown the API when it is not in use.

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

### Create an Instance

### Retrieve an Instance

### Update an Instance

### Delete an Instance

### List All Instances

### List Tenants of an Instance

## Tenants

### Create a Tenant

### Retrieve a Tenant

### Update a Tenant

### Delete a Tenant

### List All Tenants

### List Users of a Tenant

### Retrieve Instance of a Tenant

### Add Tenant to Instance

### Remove Tenant from Instance

## Users

### Create a User

### Retrieve a User

### Update a User

### Delete a User

### List All Users

### Add User to Tenant

### Remove User from Tenant

## Integrations

### Create an Integration

### Retrieve an Integration

### Update an Integration

### Delete an Integration

### List All Integrations

# Service Management

## Nodes

### Create a Node

### Retrieve a Node

### Update a Node

### Delete a Node

### List All Nodes

### Ping a Node

## Services

### Create a Service

### Retrieve a Service

### Update a Service

### Delete a Service

### List All Services

### Start a Service

### Stop a Service

### Monitor a Service

### List All Processes

### Start All Services

### Stop All Services

### Monitor All Services

## Processes

### Create a Process

### Retrieve a Process

### Delete a Process

### List All Processes

### Start a Process

### Stop a Process

### Monitor a Process
