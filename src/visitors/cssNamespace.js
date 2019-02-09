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

const EXPRESSION = 'fake-element-placeholder';
const FAKE_VALUE = 'fakevalue';

const replacementNodes = new WeakSet();

const getCssNamespace = state => {
  const { cssNamespace } = state.opts;
  if (!cssNamespace) {
    return { cssNamespace: '&&' };
  }

  return state.opts;
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
    .map((quasi, i) => {
      const rawValue = quasi.value.raw;
      const nextQuasi = quasis[i + 1];
      const rawValueWithoutWhiteSpace = rawValue.replace(/[\n\r\s]/g, '');

      // When there is no associated expression, we can return the plain string
      if (!expressions[i]) {
        return rawValue;
      }

      // In cases where the expression would result in invalid css, we need to add
      // a fake value.
      // For example,
      // .button {
      //   ${someVariableWithValidCss};
      // }
      // Without the following logic that would return as:
      // .button {
      //   EXPRESSION;
      // }
      // Which even the safe parser doesn't know how to handle.
      // So we add a fake value to make it valid css.
      // .button {
      //   EXPRESSION: fakevalue;
      // }
      if (
        (rawValueWithoutWhiteSpace === '{' ||
          rawValueWithoutWhiteSpace.endsWith(';')) &&
        nextQuasi &&
        nextQuasi.value.raw.startsWith(';')
      ) {
        return `${rawValue}${EXPRESSION}: ${FAKE_VALUE}`;
      }

      // The rest of the time we can simply append the expression placeholder to the raw value.
      return rawValue + EXPRESSION;
    })
    .join('');

  // When the cssNamespace setting starts with a self-reference,
  // we don't need to add a parent selector.
  const doesPrefixStartsWithSelfReference = cssNamespace.startsWith('&');
  // Add a self-reference if it doesn't exist so we get proper nesting
  const prefix = doesPrefixStartsWithSelfReference ? cssNamespace : '&';

  const processors = [unnest];
  if (!doesPrefixStartsWithSelfReference) {
    processors.push(parentSelector({ selector: cssNamespace }));
  }

  let formattedCss = null;
  let potentialError = null;
  postcss(processors)
    .process(`\n${prefix} {${originalStyleString}}\n`, {
      from: undefined // clears warning about SourceMap and Browserlist from postcss
    })
    .then(value => (formattedCss = value.css))
    .catch(error => {
      potentialError = `There was a problem adding namespaces to this CSS. Error: ${
        error.message
      }`;
      formattedCss = 'ERROR';
    });
  // Allows us to turn the async promise into synchronous code for the purpose of the plugin
  loopWhile(() => formattedCss === null);

  // If the css couldn't be parsed abort the plugin with an error.
  if (potentialError) {
    throw new Error(potentialError);
  }

  // Remove the fakevalue and split on the EXPRESSION so we can replace it with the real expression
  const splitCss = formattedCss.replace(/:\sfakevalue/g, '').split(EXPRESSION);
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
