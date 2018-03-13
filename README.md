# babel-plugin-styled-components-css-namespace

## Getting Started

1. Add the plugin with `yarn add @quickbaseoss/babel-plugin-styled-components-css-namespace` or `npm install @quickbaseoss/babel-plugin-styled-components-css-namespace`
1. Include the plugin in your babel configuration.

``` json
"babel": {
  "plugins": [
    "@quickbaseoss/babel-plugin-styled-components-css-namespace"
  ]
}
```

If you are also using [babel-plugin-styled-components](https://github.com/styled-components/babel-plugin-styled-components), you must place `styled-components-css-namespace` **before** `styled-components`.

``` json
"babel": {
  "plugins": [
    "@quickbaseoss/babel-plugin-styled-components-css-namespace",
    "styled-components"
  ]
}
```

## Options

### Default

Without adding options, this plugin will duplicate the class name generated by `styled-components` as suggested in [this issue](https://github.com/styled-components/styled-components/issues/613).

``` css
// output
.hzy34z.hzy34z {background-color: blue;}
```

### Single Namespace

You can provide a `cssNamespace` to use instead of duplicating the class name. Remember to include a DOM element with that class that wraps the styled-component.

``` json
"babel": {
  "plugins": [
    ["styled-components-css-namespace", {"cssNamespace": "moreSpecific"}],
    "styled-components"
  ]
}
```

``` css
// output
.moreSpecific .hzy34z {background-color: blue;}
```

### Multiple Namespaces

You can provide an array `cssNamespace`s to use instead of duplicating the class name. Remember to include a DOM element with those classes that wraps the styled-component.

``` json
"babel": {
  "plugins": [
    ["styled-components-css-namespace", {"cssNamespace": ["moreSpecific", "reallySpecific", "extraSpecific"]}],
    "styled-components"
  ]
}
```

``` css
// output
.moreSpecific .reallySpecific .extraSpecific .hzy34z {background-color: blue;}
```

## The Problem

[styled-components](https://github.com/QuickBase/styled-components) is an awesome library for css-in-js and feels like a natural combination of React and CSS. It is easy to use and produces css instead of inline styles.

However, if you are trying to gradually introduce [styled-components](https://github.com/QuickBase/styled-components) into a legacy website that might not have the best CSS, the legacy styles may bleed into your styled-components because they have more specificity than the single class styled-components.

## The Solution

This plugin will automatically add additional css namespaces or duplicated classes to the selectors produced by styled components effectively creating a wall between the legacy css code and your new shiny styled components.

![monty-python-castle](https://media.giphy.com/media/12TIvbgMTrGhhu/giphy.gif)

## Developing

1. Clone the repo with `git clone https://github.com/QuickBase/babel-plugin-styled-components-css-namespace.git`
1. `yarn install` (prefer `yarn` although `npm` should work as well)
1. `yarn test` to run the tests

# Publishing

When we are ready to release a new version, one of the admins needs to run the following commands to publish the new version to npm.
We probably need to invest in a better deploy and semver management system. Interested? See [this issue](https://github.com/QuickBase/babel-plugin-styled-components-css-namespace/issues/9).

- If needed, open a new PR to update the version in the [package.json](https://github.com/QuickBase/babel-plugin-styled-components-css-namespace/blob/master/package.json)
- Copy the commit hash from the [commit log](https://github.com/QuickBase/babel-plugin-styled-components-css-namespace/commits/master)
- Run `git tag -a {version} {commit_hash}`
- In the editor, add a message about the changes in this version and save
- Push the tag to GitHub with `git push --follow-tags`
- Travis CI will build and publish the new version to npm
