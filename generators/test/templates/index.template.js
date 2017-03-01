// Auto-generated do not edit


/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import <%- filename %> from '.<%-componentsPath%><%-currentFilePath.split('.')[0]%>';


describe('<%-filename%> test', () => {
  it('<%- filename %> should match snapshot', () => {
    const component = renderer.create(<<%- filename%> <%- componentProps.map(componentMeta => ""+componentMeta.propName+"={"+(componentMeta.propType !== 'func'?"'":'')+componentMeta.propDefaultValue+(componentMeta.propType !== 'func'?"'":'')+"}").join(' ') %> />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
