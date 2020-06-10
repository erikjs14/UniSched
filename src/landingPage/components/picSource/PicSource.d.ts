export interface PicSourceProps {
    item: {
        pngSet: string;
        webpSet: string;
        fallback: string;
        sizes: string;
    }
    figClass: string;
    imgClass: string;
    alt: string;
}