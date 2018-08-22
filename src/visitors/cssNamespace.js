import * as t from 'babel-types';
import { isStyled } from 'babel-plugin-styled-components/lib/utils/detectors';

const getCssNamespace = cssNamespace =>
  `.${[].concat(cssNamespace).join(' .')} &`;

export default (path, state, namespace) => {
  const cssNamespace = getCssNamespace(namespace);
  if (
    isStyled(path.node.tag, state) &&
    path.node.quasi.quasis[0].value.cooked &&
    !path.node.quasi.quasis[0].value.cooked.startsWith(`\n${cssNamespace} {`) &&
    (path.node.tag.property
      ? path.node.tag.property.name !== 'keyframes'
      : true)
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
