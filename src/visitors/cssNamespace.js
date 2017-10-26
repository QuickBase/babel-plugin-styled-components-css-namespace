import * as t from 'babel-types';
import {
  isStyled,
  isHelper
} from 'babel-plugin-styled-components/lib/utils/detectors';

export default (path, state) => {
  if (isStyled(path.node.tag, state) || isHelper(path.node.tag, state)) {
    const { tag: callee, quasi: { quasis, expressions } } = path.node;

    const originalQuasis = quasis.map(quasi =>
      t.stringLiteral(quasi.value.cooked)
    );
    const values = t.arrayExpression([
      t.stringLiteral('&& {'),
      ...originalQuasis,
      t.stringLiteral('}')
    ]);

    path.replaceWith(t.callExpression(callee, [values, ...expressions]));
  }
};
