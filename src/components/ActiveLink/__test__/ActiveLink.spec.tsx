import { render, screen } from '@testing-library/react'

import { ActiveLink } from '..'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/home',
      }
    },
  }
})

describe('[Component] ActiveLink', () => {
  it('renders correct', () => {
    render(
      <ActiveLink activeClassName="active" href="/home">
        <a>Home</a>
      </ActiveLink>,
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('adds active class if the link as currently active', () => {
    render(
      <ActiveLink activeClassName="active" href="/home">
        <a>Home</a>
      </ActiveLink>,
    )

    expect(screen.getByText('Home')).toHaveClass('active')
  })
})
