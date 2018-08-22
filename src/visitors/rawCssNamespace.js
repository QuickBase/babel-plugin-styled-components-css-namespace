import { transform } from 'babel-core';
import * as t from 'babel-types';
// import uuid from 'uuid/v4';
import { isStyled } from 'babel-plugin-styled-components/lib/utils/detectors';
import {
  getStyleBlocks,
  getSylesForSelfOmmitedCssRule,
  getCssRuleWrapped,
  setDebugMode
} from './styleBuilderUtils';

/**
 *
 * @param {AST} path
 * @param {array} cssNamespaces
 */
function isStyledComponent(path, state, cssNamespaces) {
  return cssNamespaces.some(
    cssNamespace =>
      isStyled(path.node.tag, state) &&
      path.node.quasi.quasis[0].value.cooked &&
      !path.node.quasi.quasis[0].value.cooked.startsWith(`\n${cssNamespace}`) &&
      (path.node.tag.property
        ? path.node.tag.property.name !== 'keyframes'
        : true)
  );
}

export default (path, state, namespaces) => {
  const { debug } = state.opts;
  setDebugMode(debug);

  const cssNamespaces = [].concat(namespaces);
  if (isStyledComponent(path, state, cssNamespaces)) {
    const { tag: callee, quasi } = path.node;
    const { quasis, expressions } = quasi;

    let values;
    if (quasis.length === 1) {
      const {
        styleSelfOmmitedCssRule,
        remainingCss
      } = getSylesForSelfOmmitedCssRule(quasis[0].value.raw);
      const styleBlocks = getStyleBlocks(remainingCss);
      const outputCss = getCssRuleWrapped(
        cssNamespaces,
        styleSelfOmmitedCssRule,
        styleBlocks
      );

      values = [
        t.templateElement(
          {
            cooked: `\n{${outputCss}}\n`,
            raw: `\n{${outputCss}}\n`
          },
          quasis[0].tail
        )
      ];
    } else {
      // console.log('\n\n\n\n');
      // console.log('quasi.expressions[0]:', quasi.expressions[0]);
      // console.log('\n\n\n\n');
      // console.log('quasi:', quasi);
      // console.log('\n\n\n\n');
      // console.log('path:', path);
      // console.log('\n\n\n\n');
      // // console.log('state:', state);
      // console.log('state.file.code:', state.file.code);
      console.log('\n\n\n\n');
      const rawCode = state.file.code.substring(quasi.start, quasi.end);
      console.log('state.file.code.template:', rawCode);
      console.log('\n\n\n\n');
      // // t.templateElement(
      console.log(
        'state.file.code.ast:',
        transform(state.file.code.substring(quasi.start, quasi.end), {})
      );
      // console.log('\n\n\n\n');
      // console.log(
      //   'state.file.code.ast.II:',
      //   transformFromAst(
      //     quasi,
      //     state.file.code.substring(quasi.start, quasi.end)
      //   )
      // );
      // console.log('\n\n\n\n');
      // console.log('callee:', callee);
      // console.log('\n\n\n\n');
      // console.log(
      //   'quasis[0].value.cooked:',
      //   JSON.stringify(quasis[0].value.cooked)
      // );
      console.log('\n\n\n\n');
      console.log('quasis[0].value.raw:', quasis[0].value.raw);
      console.log('\n\n\n\n');
      console.log('quasis[1].value.raw:', quasis[1].value.raw);
      console.log('\n\n\n\n');
      console.log('quasis[2].value.raw:', quasis[2].value.raw);
      console.log('\n\n\n\n');
      console.log('quasis[3].value.raw:', quasis[3].value.raw);
      console.log('\n\n\n\n');
      console.log('quasis[4].value.raw:', quasis[4].value.raw);
      console.log('\n\n\n\n');
      // strategy replacement did not work
      // const itemsToReplace = [];
      // const transientLiterals = [];
      // quasis.forEach((quasiItem, quasiIndex) => {
      //   const identifier = uuid();
      //   if (t.isArrowFunctionExpression(quasiItem)) {
      //     const replacement = t.identifier(identifier);
      //     itemsToReplace.push({
      //       factory: 'arrowFunctionExpression',
      //       quasi: quasiItem,
      //       replacedBy: replacement,
      //       index: quasiIndex
      //     });
      //     transientLiterals.push(replacement);
      //   } else if (t.isTemplateElement(quasiItem)) {
      //     const replacement = t.identifier(identifier);
      //     itemsToReplace.push({
      //       factory: 'templateElement',
      //       quasi: quasiItem,
      //       replacedBy: replacement,
      //       index: quasiIndex
      //     });
      //     transientLiterals.push(replacement);
      //   } else {
      //     transientLiterals.push(quasiItem);
      //   }
      // });
      // path.replaceWith(
      //   t.taggedTemplateExpression(
      //     callee,
      //     t.templateLiteral(transientLiterals, expressions)
      //   )
      // );

      console.log('\n\n\n\n');
      const newRawCode = state.file.code.substring(quasi.start, quasi.end);
      console.log('new state.file.code.template:', newRawCode);
      console.log('\n\n\n\n');

      const first = t.templateElement(
        {
          cooked: `\n${cssNamespace} {${quasis[0].value.cooked}`,
          raw: `\n${cssNamespace} {${quasis[0].value.raw}`
        },
        quasis[0].tail
      );
      const last = t.templateElement(
        {
          cooked: `${quasis[quasis.length - 1].value.cooked}}\n`,
          raw: `${quasis[quasis.length - 1].value.raw}}\n`
        },
        quasis[quasis.length - 1].tail
      );
      values = [first, ...quasis.slice(1, quasis.length - 1), last];
    }

    path.replaceWith(
      t.taggedTemplateExpression(callee, t.templateLiteral(values, expressions))
    );
  }
};
