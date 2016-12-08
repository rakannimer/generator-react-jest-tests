// Auto-generated do not edit


/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import <%= filename %> from '../components/<%=filename%>';

<%= JSON.stringify(componentProps, 2, 2) />

describe('<%=filename%> test', () => {
  it('<%= filename %> should match snapshot', () => {
    const component = renderer.create(<<%= filename%> />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
