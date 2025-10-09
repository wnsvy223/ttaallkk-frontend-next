import { notFound } from 'next/navigation';
import BoardContentCard from '@/components/community/BoardContentCard';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

const VALID_CATEGORIES = ['free', 'talk', 'tip', 'ads'] as const;
type Category = typeof VALID_CATEGORIES[number];

interface PostContentProps {
    params: Promise<{
        category: string;
        postId: string;
    }>;
}

export default async function PostContentPage({ params }: PostContentProps) {
    const {  postId, category } = await params;
   
    // 게시글 데이터 가져오기
    const response = await fetch(`http://localhost:8080/api/post/${postId}`, { 
        cache: 'no-store',
        headers: {
            'X-Custom-Uid': 'anonymous' // TODO: 로그인한 유저는 uid값으로 설정해야함
        }
    });
   
    try {
        const post = await response.json();
        
        return (
            <div className="mx-auto max-w-7xl">
                <PageBreadcrumb pathname={`/community/${category}`} />
            <div className="mx-auto max-w-4xl">
                <BoardContentCard 
                    postId={post.id}
                    title={post.title}
                    commentCnt={post.commentCnt}
                    views={post.views}
                    createdAt={post.createdAt}
                    content={post.content}
                    displayName={post.displayName}
                    profileUrl={post.profileUrl}
                    uid={post.uid}/>
                </div>
            </div>
        );
    } catch (error){
        notFound();
    }
}

export async function generateMetadata({ params }: PostContentProps) {
    const {  postId, category } = await params;
    return {
        title: `게시글 ${postId} | ${category}`
    };
}