# Hexim Core

The domain layer of Hexim, intended for use in front- and back-end applications.

## Getting started

Normal `npm` vibes, just note that the code root dir is `lib`, so be there to
run any commands, like `nvm use` and `npm install`.

Check the `scripts` section in `lib/package.json`, and note that the formatter
is `standard` (a preset bunch of eslint rules to avoid bikeshedding).

`husky` will initialise a pre-commit hook for lint and tests.

## Contributing

Not expecting any, but hmu if you're keen, for whatever reason.

## Acknowledgements

`prng` has some interesting licence details, and is not the `prng` published on
`npm`. This codebase only uses `LFib4` from that package, so I think it's safe,
but lmk if you disagree.

Also, I'm very grateful to have found a relatively-portable set of pseudo-random
number generators with strong principles and references. I'm not sure that this
game will be exclusively JS forever, so it was an important find.

## Licence

```
Copyright 2024 Orochi Corp.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

See also: [./licence.txt]

### Extensions

This licence is intended to allow embeddings of this package in applications
that facilitate gameplay. There will be first-party apps (a web-based front-end,
and an API to support online multiplayer games), which might not be FOSS, and
this should also allow third-party alternatives.
