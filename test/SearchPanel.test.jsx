import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchPanel from '../src/components/SearchPanel'

test('instant suggestions appear and can be selected', async () => {
  render(<SearchPanel />)
  const input = screen.getByPlaceholderText('Search text (title, description)')
  await userEvent.type(input, 'Oak', { delay: 10 })

  // Wait for suggestion option to appear
  const option = await screen.findByRole('option')
  expect(option).toBeInTheDocument()

  // Click the suggestion and expect input value to change
  await userEvent.click(option)
  expect(input).toHaveValue(expect.stringContaining('Oak'))
})
