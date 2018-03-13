import * as t from 'babel-types';
import {
  isStyled,
  isHelper
} from 'babel-plugin-styled-components/lib/utils/detectors';

const getCssNamespace = state => {
  const { cssNamespace } = state.opts;
  if (!cssNamespace) {
    return '&&';
  }

  if (Array.isArray(cssNamespace)) {
    return `.${cssNamespace.join(' .')} &`;
  }

  return `.${cssNamespace} &`;
};

export default (path, state) => {
  const cssNamespace = getCssNamespace(state);

  if (
    isStyled(path.node.tag, state) &&
    path.node.quasi.quasis[0].value.cooked &&
    !path.node.quasi.quasis[0].value.cooked.startsWith(`\n${cssNamespace} {`)
  ) {
    const { tag: callee, quasi: { quasis, expressions } } = path.node;

    let values;
    if (quasis.length === 1) {
      values = [
        t.templateElement(
          {
            cooked: `\n${cssNamespace} {${quasis[0].value.cooked}}\n`,
            raw: `\n${cssNamespace} {${quasis[0].value.raw}}\n`
          },
          quasis[0].tail
        )
      ];
    } else {
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
