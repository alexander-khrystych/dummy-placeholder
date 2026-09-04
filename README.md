# JsonPlaceholder & DummyJSON Tests

API tests for a few endpoints of json-placeholder and dummyjson pub services.

## Pre-requisites

1. NodeJS v.24
2. pnpm v.11.25.0
3. Docker (optional, only needed if you want to run it in a container)

## How To Run

### Docker

To run the tests:
```sh
docker compose run --build --rm dummy-placeholder
```

To open html report:
```sh
open html-report/report.html
```

### Local

Install dependencies and run the tests:
```sh
pnpm install
pnpm run
```

To open html report:
```sh
pnpm report
```

# Summary

## Framework structure

The structure is pretty standard. All things are separated and live in their own "corner" - data-related stuff (dummy-data and constants), clients, tests, schemas and utils. The only 2 things that are probably worth covering are the clients. First of all, they share a common piece, which is a core of an http client - `http-client-base`. This is a minor digression from technical requirements, but I don't see any reason to drag this piece of code over into every client as it won't be DRY. The service clients are properly separated though. Every client consists of resource (endpoints) classes (1 class per 1 resource) and a single container class that provides a single access point to a client. A client gets access to base http client through inheritance of `HttpBase` class by resource classes.

```
                      composition   ┌──────────┐                        
                            ┌───────┤resource 1│◄──────┐                 
                            ▼       └──────────┘  inheritance           
  ┌─────────────┐    ┌──────────────────┐              │                 
  │ test spec 1 │◄───│client 1 container│              │                 
  └─────────────┘    └──────────────────┘              │                 
                             ▲       ┌──────────┐      │                 
                             └───────┤resource 2│◄─────┤                 
                                     └──────────┘      │   ┌───────────┐
                                                       ├───┤ http-base │
                                     ┌──────────┐      │   └───────────┘
                             ┌───────┤resource 1│◄─────┤                 
                             ▼       └──────────┘      │                 
  ┌─────────────┐    ┌──────────────────┐              │                 
  │ test spec 2 │◄───│client 2 container│              │                 
  └─────────────┘    └──────────────────┘              │                 
                             ▲       ┌──────────┐ inheritance           
                             └───────┤resource 2│◄─────┘                 
                       composition   └──────────┘                        
```

## Deliberate decisions and trade-offs

1. json-placeholder is mocked quite poorly and there are neither proper API docs nor official schemas available. So, first bit of the problem is that I had to assume both the schema and request bodies. The other decision connected to the state of its mock - should I assume the service works just fine and have overall greener tests, or should I write the tests based on what consumer would normally expect and have tests that better conform to common sense but are barely green. I went for the 2nd option because making the tests pass against a poorly mocked service just doesn't sit right with me. Because of that, some tests are based on common sense rather than docs or service's actual (mocked) behavior.
2. All helpers are placed in a single file. Potentially, this is a bad practice as it'll eventually grow into a pile, so it should be separated into multiple files. However, there are just 2 as of now, so I went for a simplier approach. This bit has to be changed as the framework scales up.
3. Docker wasn't mentioned on the list of requirements but I added it anyway to smoothen out any potential struggles with launcing the code. You'll have to install Docker though.
4. ESM syntax is achievable through either node's experimental flag or babel config. I went for the babel since it's a stable option that's been tested with time and won't potentially bring issues to the table later.
5. [One of the auth tests]() (jwt token expiration test) is `.skip`ed. The only reason behind this is to not make you wait in frustration while 15 API tests take slightly over 1 min to run. If you wish to run it – just un-skip it [here]().
6. `.env` simplification: this repo doesn't follow the common pattern of having multiple files for each environment commited and .env added to .gitignore, so that when running the code a needed .env is copied as .env and the tests are run (e.g., `cp .env.staging .env && pnpm test`). Instead, I've decided to keep just a single .env file since there's just 1 public env against which these tests are running. Same goes for secrets. Normally, those should never be commited. If run locally - they should be filled in manually. If run in CI - filled in from the secrets vault (GitHub Secrets, AWS Secrets Manager, etc.). Since it's an important bit that can be interpreted as a security neglection, I've duplicated a brief of this explanation in the .env file in case you'll diagonal-read past this.
7. `globalSetup` and `globalTeardown`. There's not much to put there for this state of tests. For globalSetup, all I could come up with are service healthcheck and imports of dotenv and custom-matchers to make them globally available without a need to drag the import into every file. There's nothing to cleanup, there's no delete access to created test data, there's no idling stuff left after a test run, so teardown is left out completely.

## Improvements or additions, should I be given more time

1. Better reporting. Log headers, params and bodies per every request/response for better tracability of issues. It's especially useful when failure silently happens in a non-last request sent and doesn't get highlighted in report. I didn't put too much time into it because I could easily spend a couple more hours tailoring every little thing.
2. I feel like error messages could be enhanced, I'm not entirely pleased with their current state.
3. GH Actions pipeline for CI integration.
4. JSDocs on all functions and classes.

## How the framework scales to 100+ tests without major refactoring

Without any issues at all. The base structure is absolutely ready for that. Let's assume you're adding tests for dummyjson's `GET /carts{id}` endpoint. In that case you'd need:
1. Create a new spec file at `/tests/dummyjson/cart.spec.ts`
2. Add .yaml schemas. The approximate tree structure should look like this:

    ```
    schemas
    ├── dummyjson
    │   ├── auth
    │   │   └── login
    │   │       └── ...
    │   └── cart
    │       └── GET
    │           ├── 200.yaml
    │           ├── 400.yaml
    │           ├── 401.yaml
    │           ├── 404.yaml
    │           ├── 500.yaml
    │           ├── ...
    ```

3. Add pathes to schema files into `/data/constants.js`, into `dummyJsonSchemaPaths` object
4. Add a resource to `/clients/dummyjson/routes/cart.js
5. Add a resource class instance creation to the client container `/clients/dummyjson/base.js`
6. As mentioned before, the `utils/helpers.js` will eventually turn into a pile, so the helpers will have to be refactored later by sorting helper functions into groups and moving them into separate files under `utils` dir.