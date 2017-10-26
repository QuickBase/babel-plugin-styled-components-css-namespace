import * as t from 'babel-types';
import {
  isStyled,
  isHelper
} from 'babel-plugin-styled-components/lib/utils/detectors';

export default (path, state) => {
  const cssNamespace = state.opts.cssNamespace
    ? `.${state.opts.cssNamespace} &`
    : '&&';

  if (
    (isStyled(path.node.tag, state) || isHelper(path.node.tag, state)) &&
    path.node.quasi.quasis[0].value.cooked &&
    !path.node.quasi.quasis[0].value.cooked.startsWith(`\n${cssNamespace} {`)
  ) {
    const { tag: callee, quasi: { quasis, expressions } } = path.node;

    const values = quasis.map(quasi =>
      t.templateElement(
        {
          cooked: `\n${cssNamespace} {${quasi.value.cooked}}\n`,
          raw: `\n${cssNamespace} {${quasi.value.cooked}}\n`
        },
        quasi.tail
      )
    );

    path.replaceWith(
      t.taggedTemplateExpression(callee, t.templateLiteral(values, expressions))
    );
  }
};
