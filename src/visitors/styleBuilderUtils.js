let isDebugMode = false;

/**
 * Sets whether is debugging or not
 *
 * @param {boolean} enabled
 */
export function setDebugMode(enabled) {
  isDebugMode = Boolean(enabled);
}

/**
 * Output info in the console along the process if isDebugMode is set to true
 *
 * @param {any} args - list of arguments that will be passed down to console.log function
 */
export function debug(...args) {
  if (isDebugMode) {
    console.log(...args);
  }
}

/**
 * Returns the css in a single line stripping out all spaces
 * and break-lines
 *
 * @param {string} css - the css style block
 *
 * @returns {string}
 */
export function getInlineStyleBlock(css) {
  return css.replace(/(\n)+/g, '');
}

// Example study case

// `background-color: #fff;
// padding: 10px;
// justify-content: center;
// &.marker,
// &.toggle {
// 	padding: 10px;
// 	justify-content: center;
// }

// &.toggle,
// .torch > &,
// &.newClass,
// & .newClass {
// 	padding: 10px;
// 	justify-content: center;
// }

// div .wrapper {
//
// }`

// // Match 1: [0]

// `background-color: #fff;
// padding: 10px;
// justify-content: center;
/**
 * Gets groups of style blocks to ommited self reference
 * @param {string} css - it is the style template string
 * @returns {object}
 */
export function getSylesForSelfOmmitedCssRule(css) {
  debug('css:', css);
  const inlineStyles = getInlineStyleBlock(css);
  const groups = /^((([^{][^;](.|\W))+:([^;][^{](.|\W))*[;]?)+)[;]/gy.exec(
    inlineStyles.trim()
  );
  if (groups && groups.length) {
    debug(
      'result after stripping css for self ommited css selector:',
      groups[0]
    );
    debug('remaining:', groups[0]);
    const remainingCss = inlineStyles.replace(groups[0], '').trim();
    return {
      styleSelfOmmitedCssRule: groups[0],
      remainingCss
    };
  }
  debug('result after stripping css for self ommited css selector:', null);
  debug('remaining:', inlineStyles);
  return {
    styleSelfOmmitedCssRule: null,
    remainingCss: inlineStyles.trim()
  };
}

// // Match 1: [0]
// `
// &.marker,
// &.toggle {
// 	padding: 10px;
// 	justify-content: center;
// }
// `
// // Match 2: [0]
// `

// &.toggle,
// .torch > &,
// &.newClass,
// & .newClass {
// 	padding: 10px;
// 	justify-content: center;
// }
// `
// // Match 3: [0]
// `

// div .wrapper {

// }
// `
/**
 * Gets groups of style blocks
 * @param {string} css - it is the style template string
 * @returns {object}
 */
export function getStyleBlocks(css) {
  return css
    .replace(/[}]/g, '}\n')
    .split(/\n/g)
    .map(styleBlockText => {
      debug('styleBlockText:', styleBlockText);
      const selectorsInline = /^((.|\W)+)[{]/g.exec(styleBlockText);
      const cssInline = /[{]((.|\W)*)[}]/g.exec(styleBlockText);
      const styleBlock = {
        selectors: [],
        css: ''
      };
      const isSelectorAvailable = Boolean(
        selectorsInline && selectorsInline.length
      );
      const isCssAvailable = Boolean(cssInline && cssInline.length);
      if (styleBlockText && isSelectorAvailable && isCssAvailable) {
        debug('selectorsInline:', selectorsInline);
        debug('cssInline:', cssInline);
        styleBlock.selectors = styleBlock.selectors.concat(
          selectorsInline[1].split(',')
        );
        styleBlock.css = cssInline[1];
        return styleBlock;
        debug('styleBlockText: returning styleBlock built with previous info');
      }
      debug('styleBlockText: returning null for this iteration');
      return null;
    })
    .filter(block => !!block);
}

// // Given

/* Namespaces */
// ['body', '#root .container']

/* Initial CSS */
// `
// font-size: 15px;
// font-weight: bold;
// color: green;
//
// &.toggle,
// .torch > &,
// &.newClass,
// & .newClass {
// 	padding: 10px;
// 	justify-content: center;
// }
// `

// Output
// `
// body &, #root .container & {
//   font-size: 15px;
//   font-weight: bold;
//   color: green;
// }
//
// body &.toggle,
// #root .container &.toggle,
// body .torch > &,
// #root .container .torch > &,
// body &.newClass,
// #root .container &.newClass,
// body & .newClass {
// #root .container & .newClass {
// 	padding: 10px;
// 	justify-content: center;
// }
// `

/**
 * Wraps the css rules with namespaces provided
 *
 * @param {array} namespaces - list of namespaces to wrap the css rules (selectors)
 * @param {string} styleSelfOmmitedCssRule - style added to the component without specifying a css rule (selector)
 * @param {array} styleBlocks = list of css grouped by its selectors
 *
 * @returns {string}
 */
export function getCssRuleWrapped(
  namespaces,
  styleSelfOmmitedCssRule,
  styleBlocks
) {
  debug('namespaces:', namespaces);
  debug('styleSelfOmmitedCssRule:', styleSelfOmmitedCssRule);
  debug('styleBlocks:', styleBlocks);
  const allBlocks = (!!styleSelfOmmitedCssRule
    ? [{ selectors: ['&'], css: styleSelfOmmitedCssRule }]
    : []
  ).concat(styleBlocks);

  const cssScoped = allBlocks.map(block => {
    const newSelectors = [];
    block.selectors.forEach(selector => {
      namespaces.forEach(namespace => {
        newSelectors.push(`${namespace} ${selector}`);
      });
    });
    const cssRulesNamespaced = newSelectors.join(', ');

    return `
      ${cssRulesNamespaced} {
        ${block.css}
      }
    `;
  });

  debug('cssScoped:', cssScoped);
  return cssScoped;
}
