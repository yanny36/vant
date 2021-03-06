import Field from '..';
import { mount, later } from '../../../test';

test('input event', () => {
  const wrapper = mount(Field);
  const input = wrapper.find('input');

  input.element.value = '1';
  input.trigger('input');
  expect(wrapper.emitted('input')[0][0]).toEqual('1');
});

test('click event', () => {
  const wrapper = mount(Field);

  wrapper.trigger('click');
  expect(wrapper.emitted('click')[0][0]).toBeTruthy();
});

test('click icon event', () => {
  const wrapper = mount(Field, {
    propsData: {
      value: 'a',
      leftIcon: 'contact',
      rightIcon: 'search',
    },
  });

  wrapper.find('.van-field__left-icon').trigger('click');
  wrapper.find('.van-field__right-icon').trigger('click');
  expect(wrapper.emitted('click').length).toEqual(2);
  expect(wrapper.emitted('click-left-icon')[0][0]).toBeTruthy();
  expect(wrapper.emitted('click-right-icon')[0][0]).toBeTruthy();
});

test('number type', () => {
  const wrapper = mount(Field, {
    propsData: {
      value: '',
      type: 'number',
    },
  });

  const input = wrapper.find('input');

  input.element.value = '1';
  input.trigger('input');
  expect(wrapper.emitted('input')[0][0]).toEqual('1');

  input.element.value = '1.2.';
  input.trigger('input');
  expect(wrapper.emitted('input')[1][0]).toEqual('1.2');

  input.element.value = '123abc';
  input.trigger('input');
  expect(wrapper.emitted('input')[2][0]).toEqual('123');
});

test('digit type', () => {
  const wrapper = mount(Field, {
    propsData: {
      value: '',
      type: 'digit',
    },
  });

  const input = wrapper.find('input');

  input.element.value = '1';
  input.trigger('input');
  expect(wrapper.emitted('input')[0][0]).toEqual('1');

  input.element.value = '1.';
  input.trigger('input');
  expect(wrapper.emitted('input')[1][0]).toEqual('1');

  input.element.value = '123abc';
  input.trigger('input');
  expect(wrapper.emitted('input')[2][0]).toEqual('123');
});

test('render textarea', async () => {
  const wrapper = mount(Field, {
    propsData: {
      type: 'textarea',
      autosize: true,
    },
  });

  await later();
  expect(wrapper).toMatchSnapshot();
});

test('autosize textarea field', () => {
  const wrapper = mount(Field, {
    propsData: {
      type: 'textarea',
      autosize: {},
    },
  });

  const value = '1'.repeat(20);
  const textarea = wrapper.find('.van-field__control');

  wrapper.setProps({ value });
  expect(textarea.element.value).toEqual(value);
});

test('autosize object', async () => {
  const wrapper = mount(Field, {
    propsData: {
      type: 'textarea',
      autosize: {
        maxHeight: 100,
        minHeight: 50,
      },
    },
  });

  const textarea = wrapper.find('.van-field__control');

  await later();
  expect(textarea.element.style.height).toEqual(('50px'));
});

test('blur method', () => {
  const fn = jest.fn();
  const wrapper = mount(Field);

  wrapper.vm.$on('blur', fn);
  wrapper.find('input').element.focus();
  wrapper.vm.blur();

  expect(fn).toHaveBeenCalledTimes(1);
});

test('focus method', () => {
  const fn = jest.fn();
  const wrapper = mount(Field);

  wrapper.vm.$on('focus', fn);
  wrapper.vm.focus();

  expect(fn).toHaveBeenCalledTimes(1);
});

test('maxlength', async () => {
  const wrapper = mount(Field, {
    attrs: {
      maxlength: 3,
    },
    propsData: {
      value: 1234,
      type: 'number',
    },
  });

  const input = wrapper.find('input');
  expect(input.element.value).toEqual('123');

  input.element.value = 1234;
  await later();
  input.trigger('input');

  expect(input.element.value).toEqual('123');
  expect(wrapper.emitted('input')[0][0]).toEqual('123');
});

test('clearable', () => {
  const wrapper = mount(Field, {
    propsData: {
      value: 'test',
      clearable: true,
    },
  });

  expect(wrapper).toMatchSnapshot();
  const input = wrapper.find('input');
  input.trigger('focus');
  expect(wrapper).toMatchSnapshot();

  wrapper.find('.van-field__clear').trigger('touchstart');
  expect(wrapper.emitted('input')[0][0]).toEqual('');
  expect(wrapper.emitted('clear')[0][0]).toBeTruthy();
});

test('render input slot', () => {
  const wrapper = mount({
    template: `
      <field>
        <template v-slot:input>Custom Input</template>
      </field>
    `,
    components: {
      Field,
    },
  });

  expect(wrapper).toMatchSnapshot();
});

test('render label slot', () => {
  const wrapper = mount({
    template: `
      <field label="Default Label">
        <template v-slot:label>Custom Label</template>
      </field>
    `,
    components: {
      Field,
    },
  });

  expect(wrapper).toMatchSnapshot();
});

test('size prop', () => {
  const wrapper = mount(Field, {
    propsData: {
      size: 'large',
    },
  });
  expect(wrapper).toMatchSnapshot();
});

test('label-width prop with unit', () => {
  const wrapper = mount(Field, {
    propsData: {
      label: 'Label',
      labelWidth: '10rem',
    },
  });
  expect(wrapper).toMatchSnapshot();
});

test('label-width prop without unit', () => {
  const wrapper = mount(Field, {
    propsData: {
      label: 'Label',
      labelWidth: 100,
    },
  });
  expect(wrapper).toMatchSnapshot();
});

test('label-class prop', () => {
  const wrapper = mount(Field, {
    propsData: {
      label: 'Label',
      labelClass: 'custom-label-class',
    },
  });
  expect(wrapper).toMatchSnapshot();
});

test('arrow-direction prop', () => {
  const wrapper = mount(Field, {
    propsData: {
      isLink: true,
      arrowDirection: 'up',
    },
  });
  expect(wrapper).toMatchSnapshot();
});

test('formatter prop', () => {
  const wrapper = mount(Field, {
    propsData: {
      value: 'abc123',
      formatter: (value) => value.replace(/\d/g, ''),
    },
  });

  const input = wrapper.find('input');

  input.trigger('input');
  expect(wrapper.emitted('input')[0][0]).toEqual('abc');

  input.element.value = '123efg';
  input.trigger('input');
  expect(wrapper.emitted('input')[1][0]).toEqual('efg');
});
