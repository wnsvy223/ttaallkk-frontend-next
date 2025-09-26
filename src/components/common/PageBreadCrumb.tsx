import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  path: string;
  label: string;
  isLast: boolean;
}

interface BreadcrumbProps {
  pageTitle?: string;
  pathname: string; // 상위 컴포넌트에서 pathname을 props로 전달받음
  customLabels?: Record<string, string>;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ 
  pageTitle, 
  pathname,
  customLabels = {} 
}) => {
  // 경로를 분할하고 빈 문자열 제거 (원본 소문자 유지)
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // 각 경로 세그먼트를 사람이 읽기 쉬운 형태로 변환
  const formatSegment = (segment: string): string => {
    // 커스텀 라벨이 있으면 사용
    if (customLabels[segment]) {
      return customLabels[segment];
    }
    
    // URL 디코딩 후 하이픈이나 언더스코어를 공백으로 변경하고 첫 글자 대문자화
    return decodeURIComponent(segment)
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  // breadcrumb 아이템들 생성
  const breadcrumbItems: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    // 경로는 원본 소문자 세그먼트들을 그대로 사용하여 구성
    const pathParts = pathSegments.slice(0, index + 1).map(part => part.toLowerCase());
    const path = '/' + pathParts.join('/');
    
    // 표시용 라벨만 포맷팅 (경로와는 별개)
    const label = formatSegment(segment);
    const isLast = index === pathSegments.length - 1;
    
    return {
      path,
      label,
      isLast
    };
  });
  
  // 현재 페이지 제목 결정
  const currentPageTitle = pageTitle || 
    (breadcrumbItems.length > 0 ? breadcrumbItems[breadcrumbItems.length - 1].label : 'Home');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {currentPageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          {/* Home 링크 */}
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              href="/"
            >
              Home
              {breadcrumbItems.length > 0 && (
                <svg
                  className="stroke-current"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </Link>
          </li>
          
          {/* 동적으로 생성된 breadcrumb 아이템들 */}
          {breadcrumbItems.map((item) => (
            <li key={item.path}>
              {item.isLast ? (
                // 마지막 아이템은 링크가 아닌 텍스트
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {item.label}
                </span>
              ) : (
                // 중간 아이템들은 클릭 가능한 링크
                <Link
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  href={item.path}
                >
                  {item.label}
                  <svg
                    className="stroke-current"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                      stroke=""
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;