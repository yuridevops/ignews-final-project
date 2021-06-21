import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import { useRouter } from "next/dist/client/router"
import Head from "next/head"
import Link from "next/link"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"
import styles from '../post.module.scss'

interface PostPreviewProps {
    post: {
        slug: string,
        title: string,
        content: string,
        updatedAt: string
    }
}

export default function PostPreview({ post }: PostPreviewProps) {

    const [session] = useSession()
    const router = useRouter()

    useEffect(() => {
        //@ts-ignore
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }
    }, [session])

    return (
        <>
            <Head>{post.title} | Ignews </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}>
                    </div>
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href="subscribe">
                            <a >Subscribe Now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>

    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [{
            params: {
                slug: 'como-renomear-varios-arquivos-de-uma-vez-usando-o-terminal'
            }
        }],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params


    const prismic = getPrismicClient()

    const response = await prismic.getByUID('publication', String(slug), {})
    const post = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content.splice(0, 4)),
        updatedAt: Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'narrow',
            year: 'numeric'
        }).format(new Date(response.last_publication_date))
    }


    return {
        props: {
            post
        }
    }


}