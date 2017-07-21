# Schema integration type
A very versatile integration type where a set of prototypes with specific JSON schema can be defined
on the installation level with a specific name, then contracts of this prototype can be defined
and cross checked between producers & consumers.

For example, to support validating contracts for tracking events in an organization this module can 
be used to define a prototype of name `trackingEvent` with a JSON schema in your config.yaml
as the following:
```yaml
schema:
  prototypes:
    - name: trackingEvent
      schema:
        type: object
        properties:
          name:
            type: string
          category:
            type: string
          description:
            type: string
          fieldsSchema:
            type: object
        required:
          - name
          - category
          - description
          - fieldsSchema
```

and then different projects can start promising and expecting contracts of type `schema` and prototype
`trackingEvent`, for example:
```yaml
- integration: schema
  dir: promises/tracking-events/add-to-basket
  meta:
    prototype: trackingEvent
    name: add-to-basket
    description: User adds a specific SKU to the shopping basket
```

and inside the promise directory, you would create `event.yaml` with the following content:
```yaml
name: add-to-wishlist
category: product-interactions
description: |
  Extended description for the event, examples and implementation details.
  Extended description for the event, examples and implementation details.
  Extended description for the event, examples and implementation details.
  Extended description for the event, examples and implementation details.
fieldsSchema:
  type: object
  properties:
    productSku:
      type: string
    userId:
      type: integer
    page:
      type: string
      enum: ["homepage", "catalog", "pdp"]
  required:
    - productSku
    - userId
```

The contract schema will be validate against the prototype definition forcing all projects to use 
a standard way of defining contracts for anything between projects.