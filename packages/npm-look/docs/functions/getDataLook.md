[**NPM Look**](../README.md)

---

[NPM Look](../README.md) / getDataLook

# Function: getDataLook()

> **getDataLook**(`name`, `opts`): `Promise`\<`any`\>

Defined in: [index.ts:44](https://github.com/teneplaysofficial/omnijs/blob/f95066233c343241272ef8ac150259c8268a9391/packages/npm-look/index.ts#L44)

Fetch npm package or username data from the registry.

## Parameters

### name

`string`

Package or username to check.

### opts

Optional settings

#### user

`boolean` = `false`

Check an npm username instead of a package.

**Default**

```ts
false;
```

## Returns

`Promise`\<`any`\>

The fetched data as JSON, or `true/false` for user availability.
