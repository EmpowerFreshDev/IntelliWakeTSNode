# IntelliWakeTSNode

> 🛠️ This is an **EmpowerFresh-maintained fork** of `@solidbasisventures/intelliwaketsnode`,  
> forked from version `2.4.55` to allow app-specific enhancements and updates.  
> We track upstream as needed but are no longer directly dependent on its release cycle.
> 📦 This package is **not published to npm**. We consume it directly via GitHub.

---

IntelliwakeTSNode, short for the IntelliWake TypeScript Node Library provides multiple helper functions in a back-end
node server that are not present in vanilla JavaScript.

Documentation on how to use these features can be found on
our [WIKI](https://github.com/SolidBasisVentures/IntelliWakeTSNode/wiki)

## Publishing

Use the following scripts found in the package.json to manage the repository:

To run unit tests:

```
pnpm run Vitest-Watch
```

Note: please update test scripts for any changes.

To run the `consoles.ts` file (with a watch for changes):

```
pnpm run TSNodeDev
```

To update the packages in the package.json:

```
pnpm run Intall-IntelliWake
```

After a significant change, update the minor version number with:

```
pnpm run Verision-Minor-Advance
```

To publish the repository to NPMJS:

```
pnpm run Publish
```
