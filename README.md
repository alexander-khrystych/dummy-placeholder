# JsonPlaceholder & DummyJSON Tests

API tests for a few endpoints of json-placeholder and dummyjson public services.

## Pre-requisites

1. NodeJS v.24
2. pnpm v.12.8.1
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
pnpm test
```

To open html report:
```sh
pnpm report
```

## Framework structure


```
                          composition    ┌──────────┐                   
                                ┌────────┤resource 1│◄────┐             
                                ▼        └──────────┘     │             
                    import  ┌──────────────────┐          │             
                      ┌─────┤client 1 container│      inheritance       
┌───────┐             │     └──────────────────┘          │             
│ data  ├──┐          │         ▲        ┌──────────┐     │             
└───────┘ import      ▼         └────────┤resource 2│◄────┤             
┌───────┐  │     ┌─────────┐             └──────────┘     │  ┌─────────┐
│ utils ├──┼────►│test spec│                              ├──┤http-base│
└───────┘  │     └─────────┘             ┌──────────┐     │  └─────────┘
┌───────┐  │          ▲         ┌────────┤resource 1│◄────┤             
│schemas├──┘          │         ▼        └──────────┘     │             
└───────┘             │     ┌──────────────────┐          │             
                      └─────┤client 2 container│      inheritance       
                    import  └──────────────────┘          │             
                                ▲        ┌──────────┐     │             
                                └────────┤resource 2│◄────┘             
                          composition    └──────────┘                   
```

## Deliberate decisions and trade-offs

1. json-placeholder is mocked quite poorly and there are neither proper API docs nor official schemas available. So, first bit of the problem is that I had to assume both the schema and request bodies. The other decision connected to the state of its mock - should I assume the service works just fine and have overall greener tests, or should I write the tests based on what consumer would normally expect and have tests that better conform to common sense but are barely green. I went for the 2nd option because making the tests pass against a poorly mocked service just doesn't sit right with me. Because of that, expected results for some tests are based on common sense rather than docs or mock's actual behavior.
2. All helpers are placed in a single file. Potentially, this is a bad practice as it'll eventually grow into an unorganized pile, so it should be separated into multiple files. However, there are just 2 as of now, so I went for a simplier approach. This bit has to be changed as the framework scales up.
3. [One of the auth tests](https://github.com/alexander-khrystych/dummy-placeholder/blob/429f58c3791228afeabb70b69acae11fc2c323db/tests/dummyjson/auth.spec.js#L49-L59) (jwt token expiration test) is `.skip`ed. The only reason behind this is to not make you wait in frustration while 15 API tests take slightly over 1 min to run. If you wish to run it – just un-skip it [here](https://github.com/alexander-khrystych/dummy-placeholder/blob/429f58c3791228afeabb70b69acae11fc2c323db/tests/dummyjson/auth.spec.js#L49).

4. `.env` simplification: this repo doesn't follow the common pattern of having multiple files for each environment commited and .env added to .gitignore, so that when running the code a needed .env is copied as .env and the tests are run (e.g., `cp .env.staging .env && pnpm test`). Instead, I've decided to keep just a single .env file since there's just 1 public env against which these tests are running. Same goes for secrets. Normally, those should never be commited. If run locally - they should be filled in manually in the gitignored `.env` file. If run in CI - they should be filled in from the secrets "vault" (GitHub Secrets, AWS Secrets Manager, etc.).

## TODO

1. Better reporting. Log headers, params and bodies per every request/response for better tracability of issues. It's especially useful when failure silently happens in a non-last request sent and doesn't get highlighted in report. I didn't put too much time into it because I could easily spend a couple more hours tailoring every little thing.
2. I feel like error messages could be enhanced, I'm not entirely pleased with their current state.
3. GH Actions pipeline for CI integration.
4. JSDocs on all functions and classes.