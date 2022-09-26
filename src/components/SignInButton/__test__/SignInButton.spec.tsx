import { render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { SignInButton } from '..'

jest.mock('next-auth/client')
describe('[Component] SignInButton', () => {
  it('render correct when user is not authentication', () => {
    const mockedUseSession = mocked(useSession)

    mockedUseSession.mockReturnValueOnce([null, false])

    const { getByText } = render(<SignInButton />)

    expect(getByText('Sign in with GitHub')).toBeInTheDocument()
  })

  it('render correct when user is authentication', () => {
    const mockedUseSession = mocked(useSession)

    mockedUseSession.mockReturnValueOnce([
      {
        user: { name: 'Jhon Doe', email: 'jhonDoe@example.com' },
        expires: 'fake-expires',
      },
      false,
    ])

    const { getByText } = render(<SignInButton />)

    expect(getByText('Jhon Doe')).toBeInTheDocument()
  })
})
