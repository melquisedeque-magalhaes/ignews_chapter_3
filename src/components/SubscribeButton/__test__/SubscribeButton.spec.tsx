import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'

import { SubscribeButton } from '..'

jest.mock('next/router')
jest.mock('next-auth/client')

describe('[Component] SubcribeButton', () => {
  it('render correct', () => {
    const useRouteMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMocked = jest.fn()

    useRouteMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirect to sign in when user is not authentication', () => {
    const useRouteMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const signInMocked = mocked(signIn)
    const pushMocked = jest.fn()

    useRouteMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    fireEvent.click(screen.getByText('Subscribe now'))

    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirect to post when user alrealdy has a subcription', () => {
    const useSessionMocked = mocked(useSession)
    const useRouteMocked = mocked(useRouter)
    const pushMocked = jest.fn()

    useRouteMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any)

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'Jhon Doe',
          email: 'jhonDoe@example.com',
        },
        expires: 'fake-expires',
        activeSubscription: 'fake-activeSubscription',
      },
      false,
    ])

    render(<SubscribeButton />)

    fireEvent.click(screen.getByText('Subscribe now'))

    expect(pushMocked).toHaveBeenCalledWith('/posts')
  })
})
