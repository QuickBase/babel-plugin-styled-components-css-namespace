import * as t from 'babel-types';
import {
  isStyled,
  isCSSHelper,
  isInjectGlobalHelper,
  isPureHelper,
  isKeyframesHelper,
  isHelper
} from 'babel-plugin-styled-components/lib/utils/detectors';
import { loopWhile } from 'deasync';
import postcss from 'postcss';
import parentSelector from 'postcss-parent-selector';
import unnest from 'postcss-nested';

const EXPRESSION = '_____';

const replacementNodes = new WeakSet();

/**
 * Validates if a css rule contains a self reference "&". It is valid if
 * `.someClass & {` or `& {`, but, in case of `.myClass { ... } .myClass + & {`
 * it would be false as the regex requires the first rule be based on a self
 * reference.
 * @param {string} css
 */
const startsWithSelfReference = css =>
  /^(([^\{]([\w-_,:+\s]+))*\&\s*([^\{]([\w-_,:+\s]+))*)+[\{]/g.test(css.trim());

/**
 * TODO:: SIMPLIFY THIS NOW THAT WE DON'T NEED TO DETECT SELF-REFERENCE
 */
const getCssNamespace = state => {
  const { cssNamespace, rawCssNamespace } = state.opts;
  if (!cssNamespace && !rawCssNamespace) {
    return { cssNamespace: '&&', hasNamespaceSelfReference: true };
  }

  const isCssNamespaceSet = !!cssNamespace;
  const wrapperClass = isCssNamespaceSet
    ? `.${[].concat(cssNamespace).join(' .')} &`
    : `${[].concat(rawCssNamespace).join(', ')}`;
  const hasNamespaceSelfReference = startsWithSelfReference(
    `${wrapperClass} {`
  );
  return { cssNamespace: wrapperClass, hasNamespaceSelfReference };
};

export default (path, state) => {
  const { cssNamespace } = getCssNamespace(state);

  const { node } = path;
  const {
    tag,
    quasi: { quasis, expressions }
  } = node;

  // Ignore nodes generated by this visitor, to prevent infinite loops
  if (replacementNodes.has(node)) return;

  // Ignore templates tagged with anything other than `styled(x)`
  // Inspired by https://github.com/TrevorBurnham/babel-plugin-namespace-styled-components
  if (!isStyled(t)(tag, state)) return;
  if (isKeyframesHelper(t)(tag, state)) return;
  if (isPureHelper(t)(tag, state)) return;
  if (isHelper(t)(tag, state)) return;
  if (isCSSHelper(t)(tag, state)) return;
  if (isInjectGlobalHelper(t)(tag, state)) return;
  if (tag.property && tag.property.name === 'keyframes') return; // Maintain backward compatibility with styled.keyframes

  // Convert the tagged template to a string, with ${} expressions replaced with placeholders
  const originalStyleString = quasis
    .map((quasi, i) =>
      expressions[i] ? quasi.value.raw + EXPRESSION : quasi.value.raw
    )
    .join('');

  const doesPrefixStartsWithSelfReference = cssNamespace.startsWith('&');
  const prefix = doesPrefixStartsWithSelfReference ? cssNamespace : '&';

  const processors = [unnest];
  if (!doesPrefixStartsWithSelfReference) {
    processors.push(parentSelector({ selector: cssNamespace }));
  }

  let formattedCss = null;
  postcss(processors)
    .process(`\n${prefix} {${originalStyleString}}\n`, {
      from: undefined // clears warning about SourceMap and Browserlist from postcss
    })
    .then(value => (formattedCss = value.css));
  loopWhile(() => formattedCss === null);

  const splitCss = formattedCss.split(EXPRESSION);
  const values = splitCss.map((value, index) =>
    t.templateElement(
      { raw: value, cooked: value.replace(/\\\\/g, '\\') },
      index === splitCss.length - 1
    )
  );

  const replacementNode = t.taggedTemplateExpression(
    tag,
    t.templateLiteral(values, expressions)
  );
  replacementNodes.add(replacementNode);

  path.replaceWith(replacementNode);
};
