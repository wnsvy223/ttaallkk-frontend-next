import Link from 'next/link'
import { numToKorean, FormatOptions } from 'num-to-korean';
import moment from "moment";
import "moment/locale/ko";
moment.locale("ko");

import { Icon } from '@iconify/react';
import LetterAvatarTailwind from "../common/LetterAvatarTailwind";
// ----------------------------------------------------------------------

interface PostContent {
  id: number;
  title: string;
  uid: string;
  displayName: string;
  profileUrl: string;
  commentCnt: number;
  views: number;
  likeCnt: number;
  disLikeCnt: number;
  createdAt: string;
}

interface PostData {
  content: PostContent[];
  totalElements: number;
  number: number;
  pageable: {
    pageSize: number;
  };
}

interface PostProps {
  post: PostData;
  page: number;
  sort: string;
  category: number;
  categorySlug?: string; // 'free', 'talk', 'tip', 'ads'
}


export default function BoardTable({ post, page, sort, category, categorySlug = 'free' } : PostProps) {
  /**
   * 게시글 번호 부여
   * (backend api로부터 조회된 페이징 데이터의 값으로 게시글 순차 번호를 부여 -> 최신글의 번호가 총 게시글 갯수)
   * @param {게시글 페이징 데이터} data
   * @param {map 인덱스 번호} index
   * @returns 게시글 번호
   */
  const rownum = (data: PostData, index: number) => data?.totalElements - data?.number * data?.pageable.pageSize - index;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr className="h-[60px]">
              <th scope="col" className="text-sm font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400 w-[5%]">
                번호
              </th>
              <th scope="col" className="text-sm font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400 w-[44%]">
                제목
              </th>
              <th scope="col" className="text-sm font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400 w-[15%]">
                작성자
              </th>
              <th scope="col" className="text-sm font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400 w-[9%]">
                조회수
              </th>
              <th scope="col" className="text-sm font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400 w-[9%]">
                좋아요
              </th>
              <th scope="col" className="text-sm font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400 w-[9%]">
                싫어요
              </th>
              <th scope="col" className="text-sm font-medium tracking-wider text-gray-700 uppercase dark:text-gray-400 w-[9%]">
                등록일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {post?.content?.map((row: PostContent, index: number) => (
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-700 relative" key={row.id}>
                <td className="py-3 px-6 text-center">
                  <Link 
                    href={`/community/${categorySlug}/${row.id}`}
                    className="absolute inset-0 z-10"
                  />
                  <span className="text-xs text-gray-500 dark:text-white">
                    {rownum(post, index)}
                  </span>
                </td>
                <td className="py-3 px-6">
                  <p className="text-sm text-gray-900 dark:text-white w-[300px] truncate">
                    {row.title}
                  </p>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <LetterAvatarTailwind displayName={row.displayName} size={26}/>
                    <p className="text-sm text-gray-900 dark:text-white w-[90px] truncate">
                      {row.displayName}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-1">
                    <Icon icon="eva:eye-fill" width="18" height="18" style={{ color: '#0baa53ff' }}/>
                    <span className="text-sm text-gray-900 dark:text-white w-[50px] truncate">
                      {numToKorean(row.views, FormatOptions.MIXED)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-1">
                    <Icon icon="eva:heart-fill" width="16" height="16" style={{ color: '#fa3a00ff' }}/>
                    <span className="text-sm text-gray-900 dark:text-white w-[50px] truncate">
                      {numToKorean(row.likeCnt, FormatOptions.MIXED)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:heart-broken" width="16" height="16" style={{ color: '#888686ff' }}/>
                    <span className="text-sm text-gray-900 dark:text-white w-[50px] truncate">
                      {numToKorean(row.disLikeCnt, FormatOptions.MIXED)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6 text-center">
                  <span className="text-xs text-gray-600 dark:text-white w-[50px] truncate inline-block">
                    {moment(row.createdAt).fromNow()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}