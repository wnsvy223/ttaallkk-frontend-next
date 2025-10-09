"use client"

import { ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Pagination
} from '@mui/material';

import moment from "moment";
import "moment/locale/ko";
moment.locale("ko");


// ----------------------------------------------------------------------

interface PagenationProps {
    totalPage: number;
    page: number;
    sort?: string;
}

export default function BoardPagenation({ totalPage, page, sort }: PagenationProps ) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChangePage = (event: ChangeEvent<unknown>, page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page - 1));
        params.set("sort", "createdAt");
        router.push(`/community/free?${params.toString()}`); 
    };
  
    return (
        <Box sx={{display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Pagination 
            count={totalPage} 
            color="primary"
            page={Number(page) + 1} 
            onChange={handleChangePage}
            />
        </Box >
    );
}
