// 디바이더 아이템 찾기
export const findDividerItem = (list: any[]) => {
    const dividerIndex = list?.findIndex((data: { isDividerMessage: boolean; }) => data?.isDividerMessage === true);
    if (dividerIndex === -1) {
        return { item: null, filteredList: list };
    }
    const item = list[dividerIndex];
    const filteredList = list.filter((_: any, index: any) => index !== dividerIndex);
    return { item, filteredList };
}