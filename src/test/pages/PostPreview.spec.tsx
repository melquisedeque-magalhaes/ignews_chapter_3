import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismic'

const mockPost = {
  slug: 'post-slug',
  title: 'post-title',
  content: 'post-content',
  updatedAt: '10 de Abril',
}

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

describe('[Pages] Post Preview', () => {
  it('render correctly', () => {
    const sessionMocked = mocked(useSession)

    sessionMocked.mockReturnValueOnce([null, false] as any)

    render(<PostPreview post={mockPost} />)

    expect(screen.getByText('post-title')).toBeInTheDocument()
    expect(screen.getByText('post-content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading ?')).toBeInTheDocument()
  })

  it('redirects user to full post if when user is subcribed', async () => {
    const sessionMocked = mocked(useSession)
    const routerMocked = mocked(useRouter)
    const pushMocked = jest.fn()

    sessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false,
    ] as any)

    routerMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any)

    render(<PostPreview post={mockPost} />)

    expect(pushMocked).toHaveBeenCalledWith('/posts/post-slug')
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'new post' }],
          content: [{ type: 'paragraph', text: 'new content' }],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any)

    const response = await getStaticProps({
      params: {
        slug: 'my-new-post',
      },
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'new post',
            content: '<p>new content</p>',
            updatedAt: '01 de abril de 2021',
          },
        },
      }),
    )
  })
})
