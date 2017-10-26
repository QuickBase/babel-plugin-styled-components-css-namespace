import * as t from 'babel-types';
import {
  isStyled,
  isHelper
} from 'babel-plugin-styled-components/lib/utils/detectors';

export default (path, state) => {
  if (isStyled(path.node.tag, state) || isHelper(path.node.tag, state)) {
    const { tag: callee, quasi: { quasis, expressions } } = path.node;
    const cssNamespace = state.opts.cssNamespace
      ? `.${state.opts.cssNamespace} &`
      : '&&';

    const values = t.arrayExpression(
      quasis.map(quasi =>
        t.stringLiteral(`\n${cssNamespace} {${quasi.value.cooked}}\n`)
      )
    );

    path.replaceWith(t.callExpression(callee, [values, ...expressions]));
  }
};
