import { render, screen } from '@testing-library/react'
import { getSession } from "next-auth/client"
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { mocked } from 'ts-jest/utils' 
import { getPrismicClient } from '../../services/prismic'

const mockPost = {
    slug: 'post-slug',
    title: 'post-title',
    content: 'post-excerpt',
    updatedAt: '10 de Abril',
}

 jest.mock("../../services/prismic")
 jest.mock("next-auth/client")

describe("[Page] Post", () => {
    it("render correctly", () => {
        render(<Post post={mockPost}  />)

        expect(screen.getByText("post-title")).toBeInTheDocument()
        expect(screen.getByText("post-excerpt")).toBeInTheDocument()
    })

    it("redirects user if activeSubscription not found", async () => {
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockReturnValueOnce({
            activeSubscription: null
        } as any)

        const response = await getServerSideProps({ 
            params: {
                slug: 'my-post'
            } 
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: '/',
                })
            })
        )
    })

    it("loads initial data", async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)
        const getSessionMocked = mocked(getSession)

        getSessionMocked.mockReturnValueOnce({
            activeSubscription: 'active'
        } as any)

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [{ type: 'heading', text: 'new post' }],
                    content: [{ type: 'paragraph', text: 'new content' }]
                },
                last_publication_date: '04-01-2021'   
            }) 
        } as any)

        const response = await getServerSideProps({ 
            req: {
                cookies: {}
            }, 
            params: {
                slug: 'my-post'
            } 
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-post',
                        title: 'new post',
                        content: '<p>new content</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )
    })
})
