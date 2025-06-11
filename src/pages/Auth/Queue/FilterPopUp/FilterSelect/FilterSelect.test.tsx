import { render, screen } from '@testing-library/react';
import CommonTestWrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
import FilterSelect from './FilterSelect';

const data = [
  {
    value: 1,
    label: 'Every minutes'
  },
  {
    value: 2,
    label: 'Every hours'
  },
  {
    value: 3,
    label: 'Every 3 hours'
  }
];
it('renders FilterSearch', () => {
  render(
    <CommonTestWrapper>
      <FilterSelect name={'queue_number'} fieldKey={'queue_no'} placeholder={'Queue number'} optionList={data} />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId('filterSearch')).toBeInTheDocument();
});
