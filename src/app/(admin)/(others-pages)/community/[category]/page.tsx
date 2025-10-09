import { notFound } from 'next/navigation';
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BoardTable from '@/components/community/BoardTable';
import BoardPagenation from "@/components/community/BoardPagenation";
import PostSearch from "@/components/community/PostSearch";
import SortableMenu from "@/components/community/SortableMenu";
import Button from '@/components/ui/button/Button';

// 허용된 카테고리 목록
const VALID_CATEGORIES = ['free', 'talk', 'tip', 'ads'] as const;
type Category = typeof VALID_CATEGORIES[number];

// 카테고리별 정보
const CATEGORY_INFO: Record<Category, { title: string; description: string; id: number }> = {
    free: { title: '자유게시판', description: '자유롭게 이야기를 나눠보세요', id: 1 },
    talk: { title: '대화게시판', description: '소통하고 대화해요', id: 2 },
    tip: { title: 'Q&A게시판', description: '질문하고 답변해요', id: 3 },
    ads: { title: '홍보게시판', description: '홍보하고 알려요', id: 4 },
};

interface PageProps {
    params: Promise<{
        category: string;
    }>;
    searchParams: Promise<{
        keyword?: string;
        page?: string;
        sort?: string;
    }>;
}

// 유효한 카테고리인지 확인
function isValidCategory(category: string): category is Category {
    return VALID_CATEGORIES.includes(category as Category);
}

export default async function CommunityPage({ params, searchParams }: PageProps) {
    // params와 searchParams를 await로 받아야 함
    const { category } = await params;
    const resolvedSearchParams = await searchParams;
    
    const page = Number(resolvedSearchParams.page) || 0;  // 페이지 넘버 쿼리스트링
    const sort = resolvedSearchParams.sort || 'createdAt'; // 정렬 방식 쿼리스트링
    const keyword = resolvedSearchParams.keyword ?? ""; // 검색 키워드 쿼리스트링

    // 유효하지 않은 카테고리면 404
    if (!isValidCategory(category)) {
        notFound();
    }

    const categoryInfo = CATEGORY_INFO[category];

    const apiUrl = keyword ?
        `http://localhost:8080/api/post/search?keyword=${keyword}&category=${categoryInfo.id}&page=${page}&sort=${sort}` 
        : 
        `http://localhost:8080/api/post?category=${categoryInfo.id}&page=${page}&sort=${sort}`

    try {
        const response = await fetch(apiUrl, { 
            cache: 'no-store',
            headers: {
                'X-Custom-Uid': 'anonymous' // TODO: 로그인한 유저는 uid값으로 설정해야함
            }}
        );

        const post = await response.json();

        return (
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {categoryInfo.title}
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {categoryInfo.description}
                    </p>
                </div>
                <PageBreadcrumb pathname={`/community/${category}`} />
                <div>
                    <PostSearch />
                    <div className='flex justify-between pt-3 pb-3'>
                        <Button size='sm'>새 글 작성</Button>
                        <SortableMenu />
                    </div>
                    <BoardTable 
                        post={post} 
                        page={page} 
                        sort={sort} 
                        category={categoryInfo.id}
                        categorySlug={category}
                    />
                    <BoardPagenation totalPage={post.totalPages} page={page} />
                </div>
            </div>
        );
    } catch (error){
        notFound();
    }
}

// 정적 경로 생성 (선택사항 - 빌드 시 미리 생성)
export function generateStaticParams() {
    return VALID_CATEGORIES.map((category) => ({
        category,
    }));
}

// 메타데이터 생성
export async function generateMetadata({ params }: PageProps) {
    const { category } = await params;

    if (!isValidCategory(category)) {
        return { title: 'Not Found' };
    }

    const categoryInfo = CATEGORY_INFO[category];

    return {
        title: `${categoryInfo.title} | 커뮤니티`,
        description: categoryInfo.description,
    };
}