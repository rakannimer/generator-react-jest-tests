
// Auto-generated do not edit


/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import <%- filename %> from '<%-relativeFilePath%>';


describe('<%-filename%> test', () => {
  it('<%- filename %> should match snapshot', () => {
    const component = renderer.create(<<%- filename%>
      <%- componentProps.map(componentMeta => {
        return ""+componentMeta.propName+"={"+
          // (
          //   (componentMeta.propType === 'string')
          //     ?
          //   "'"
          //     :
          //   ''
          // )
          //   +
          (
            (componentMeta.propType === 'shape' || componentMeta.propType === 'string') ?
              JSON.stringify(componentMeta.propDefaultValue,null,1)
              :
              componentMeta.propDefaultValue
          )
          //   +
          // (
          //   (componentMeta.propType === 'string')
          //     ?
          //   "'"
          //     :
          //   ''
          // )
            +
          "}"
      }  ).join(' ') %> />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
