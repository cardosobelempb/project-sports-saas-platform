# 13 — Builder de schema Fastify

Com `exactOptionalPropertyTypes: true`, não passe `undefined`.

Crie:

```txt
src/shared/http/build-fastify-schema.ts
```

```ts
import type { FastifySchema } from "fastify";
import type { RouteDefinition } from "./types";

export function buildFastifySchema(route: RouteDefinition): FastifySchema {
  const schema: FastifySchema = {};

  if (route.docs?.tags) {
    schema.tags = route.docs.tags;
  }

  if (route.docs?.summary) {
    schema.summary = route.docs.summary;
  }

  if (route.docs?.description) {
    schema.description = route.docs.description;
  }

  if (route.schema?.body) {
    schema.body = route.schema.body;
  }

  if (route.schema?.params) {
    schema.params = route.schema.params;
  }

  if (route.schema?.query) {
    schema.querystring = route.schema.query;
  }

  if (route.schema?.response) {
    schema.response = route.schema.response;
  }

  return schema;
}
```

## Onde usar

```ts
schema: buildFastifySchema(route)
```

## Onde não usar

Evite:

```ts
schema: {
  tags: route.docs?.tags
}
```

Com `exactOptionalPropertyTypes`, isso gera erro porque passa `undefined`.
