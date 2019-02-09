import pluginTester from 'babel-plugin-tester';
import plugin from '../index';
import path from 'path';

pluginTester({
  plugin,
  pluginName: 'styled-components-css-namespace',
  filename: __filename,
  snapshot: true,
  tests: [
    {
      title: 'adds namespace to simple styled-component',
      fixture: path.join(__dirname, './fixtures/simple_styled_component.js')
    },
    {
      title: 'adds namespace to complex styled-component',
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title: 'uses a namespace specified in the options',
      pluginOptions: {
        cssNamespace: '.moreSpecific'
      },
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title: 'uses an array of namespaces specified in the options',
      pluginOptions: {
        cssNamespace: '.specific .verySpecific .extraSpecific'
      },
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title:
        'does not transform a template string that is not a styled component',
      snapshot: false, // snapshot should be false because code should be unmodified
      fixture: path.join(__dirname, './fixtures/not_styled_component.js')
    },
    {
      title: 'does not add extra selectors to child helper styles',
      fixture: path.join(
        __dirname,
        './fixtures/nested_helper_styled_component.js'
      )
    },
    {
      title: 'does not add namespace to keyframes',
      pluginOptions: {
        cssNamespace: '.specific'
      },
      fixture: path.join(__dirname, './fixtures/keyframes_styled_component.js')
    },
    {
      title: 'adds namespace to extended styled-components',
      pluginOptions: {
        cssNamespace: 'body .specific .rule'
      },
      fixture: path.join(__dirname, './fixtures/extended_styled_component.js')
    },
    {
      title:
        'uses a namespace specified in the options as simple wrapper raw wrapper',
      pluginOptions: {
        cssNamespace: 'body .specific .rule'
      },
      fixture: path.join(__dirname, './fixtures/complex_styled_component.js')
    },
    {
      title:
        'does not add namespace to keyframes as part of the simple raw wrapper',
      pluginOptions: {
        cssNamespace: 'body .specific .rule'
      },
      fixture: path.join(__dirname, './fixtures/keyframes_styled_component.js')
    },
    {
      title: 'namespaces a style block with &&',
      pluginOptions: {
        cssNamespace: '#different-wrapper'
      },
      fixture: path.join(__dirname, './fixtures/double_ampersand.js')
    },
    {
      title: 'namespaces a style block with interpolated selectors',
      pluginOptions: {
        cssNamespace: '#different-wrapper'
      },
      fixture: path.join(__dirname, './fixtures/interpolated_selector.js')
    },
    {
      title: 'does not namespace style blocks in helpers',
      pluginOptions: {
        cssNamespace: '#different-wrapper'
      },
      fixture: path.join(__dirname, './fixtures/helpers.js')
    },
    {
      title: 'handles case where styled component ends with expression',
      pluginOptions: {
        cssNamespace: '#different-wrapper'
      },
      fixture: path.join(
        __dirname,
        './fixtures/styled_components_ends_with_expression.js'
      )
    },
    {
      title:
        'handles case where styled component has only an expression in a css block',
      pluginOptions: {
        cssNamespace: '#different-wrapper'
      },
      fixture: path.join(
        __dirname,
        './fixtures/styled_components_only_expression_in_block.js'
      )
    }
  ]
});
