import fallback_250 from '../../assets/img/videoFallback/videoFallback_w_250.jpg';
import fallback_428 from '../../assets/img/videoFallback/videoFallback_w_428.jpg';
import fallback_562 from '../../assets/img/videoFallback/videoFallback_w_562.jpg';
import fallback_676 from '../../assets/img/videoFallback/videoFallback_w_676.jpg';
import fallback_776 from '../../assets/img/videoFallback/videoFallback_w_776.jpg';
import fallback_878 from '../../assets/img/videoFallback/videoFallback_w_878.jpg';
import fallback_961 from '../../assets/img/videoFallback/videoFallback_w_961.jpg';
import fallback_1033 from '../../assets/img/videoFallback/videoFallback_w_1033.jpg';
import fallback_1113 from '../../assets/img/videoFallback/videoFallback_w_1113.jpg';
import fallback_1177 from '../../assets/img/videoFallback/videoFallback_w_1177.jpg';
import fallback_1246 from '../../assets/img/videoFallback/videoFallback_w_1246.jpg';
import fallback_1280 from '../../assets/img/videoFallback/videoFallback_w_1280.jpg';
import fallback_250_webp from '../../assets/img/videoFallback/videoFallback_w_250.webp';
import fallback_428_webp from '../../assets/img/videoFallback/videoFallback_w_428.webp';
import fallback_562_webp from '../../assets/img/videoFallback/videoFallback_w_562.webp';
import fallback_676_webp from '../../assets/img/videoFallback/videoFallback_w_676.webp';
import fallback_776_webp from '../../assets/img/videoFallback/videoFallback_w_776.webp';
import fallback_878_webp from '../../assets/img/videoFallback/videoFallback_w_878.webp';
import fallback_961_webp from '../../assets/img/videoFallback/videoFallback_w_961.webp';
import fallback_1033_webp from '../../assets/img/videoFallback/videoFallback_w_1033.webp';
import fallback_1113_webp from '../../assets/img/videoFallback/videoFallback_w_1113.webp';
import fallback_1177_webp from '../../assets/img/videoFallback/videoFallback_w_1177.webp';
import fallback_1246_webp from '../../assets/img/videoFallback/videoFallback_w_1246.webp';
import fallback_1280_webp from '../../assets/img/videoFallback/videoFallback_w_1280.webp';
import { ItemType } from '../../components/picSource/PicSource.d';

export const fallbackJpgSet = `
    ${fallback_250} 250w,
    ${fallback_428} 428w,
    ${fallback_562} 562w,
    ${fallback_676} 676w,
    ${fallback_776} 776w,
    ${fallback_878} 878w,
    ${fallback_961} 961w,
    ${fallback_1033} 1033w,
    ${fallback_1113} 1113w,
    ${fallback_1177} 1177w,
    ${fallback_1246} 1246w,
    ${fallback_1280} 1280w,
`;
export const fallbackWebpSet = `
    ${fallback_250_webp} 250w,
    ${fallback_428_webp} 428w,
    ${fallback_562_webp} 562w,
    ${fallback_676_webp} 676w,
    ${fallback_776_webp} 776w,
    ${fallback_878_webp} 878w,
    ${fallback_961_webp} 961w,
    ${fallback_1033_webp} 1033w,
    ${fallback_1113_webp} 1113w,
    ${fallback_1177_webp} 1177w,
    ${fallback_1246_webp} 1246w,
    ${fallback_1280_webp} 1280w,
`;
export const fallbackFallback = fallback_776;
export const fallbackSizes = `
    (min-width: 601px) 50vw,
    90vw
`;

export const fallbackImgItem: ItemType = {
    webpSet: fallbackWebpSet,
    fallbackSet: fallbackJpgSet,
    fallbackType: 'image/jpg',
    fallback: fallbackFallback,
    sizes: fallbackSizes,
};