# Contributing

# Development

The `mcps-logger` package is used to redirect stdio logs into the console during development. To
enable the logger:

1. Set the `ENABLE_MCPS_LOGGER` env to `true`.

2. Build MCP server and run it with a client.

3. Run `npx mcps-logger` in a new terminal tab.

Now logs like `console.log("test")` should show up in the new terminal tab.
