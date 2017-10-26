import pluginTester from 'babel-plugin-tester';
import plugin from '../index';
import path from 'path';

pluginTester({
  plugin,
  pluginName: 'styled-components-css-namespace',
  filename: __filename,
  fixtures: path.join(__dirname, './fixtures')

  // tests: [
  //   {
  //     fixture: path.join(
  //       __dirname,
  //       './cssNamespaceFixtures/01_Add_css_namespace_to_styled_components/input.js'
  //     ),
  //     outputFixture: path.join(
  //       __dirname,
  //       './cssNamespaceFixtures/01_Add_css_namespace_to_styled_components/output.js'
  //     )
  //   }
  // ]
});
