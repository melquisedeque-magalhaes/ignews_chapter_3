import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { mocked } from 'ts-jest/utils'
import { getPrismicClient } from '../../services/prismic'

const mockPost = [
  {
    slug: 'post-slug',
    title: 'post-title',
    excerpt: 'post-excerpt',
    updatedAt: '10 de Abril',
  },
]

jest.mock('../../services/prismic')

describe('[Page] Posts', () => {
  it('render correctly', () => {
    render(<Posts posts={mockPost} />)

    expect(screen.getByText('post-title')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockReturnValueOnce({
        results: [
          {
            uid: '1',
            data: {
              title: [{ type: 'heading', text: 'new post' }],
              content: [{ type: 'paragraph', text: 'new content' }],
            },
            last_publication_date: '04-01-2021',
          },
        ],
      }),
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: '1',
              title: 'new post',
              excerpt: 'new content',
              updatedAt: '01 de abril de 2021',
            },
          ],
        },
      }),
    )
  })
})
