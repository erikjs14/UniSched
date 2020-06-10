export interface ItemType {
    fallbackSet: string;
    fallbackType: string;
    webpSet: string;
    fallback: string;
    sizes: string;
}
export interface PicSourceProps {
    scrollPosition?: ScrollPosition;
    item: ItemType,
    figClass: string;
    imgClass?: string;
    alt: string;
}