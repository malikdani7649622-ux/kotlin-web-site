export type CaseStudyType = 'multiplatform' | 'server-side';

export type  CaseTypeSwitch = 'all' | CaseStudyType;

type CaseStudyDestination = 'internal' | 'external';

export const Platforms = [
    'android',
    'ios',
    'desktop',
    'frontend',
    'backend',
] as const;

export type CasePlatform = typeof Platforms[number] | 'compose-multiplatform';

type Signature = {
    line1: string;
    line2: string;
}

type YoutubeMedia = {
    type: 'youtube';
    url: string;
};

type ImageMedia = {
    type: 'image';
    path: string;
};

type Media = YoutubeMedia | ImageMedia;

interface CaseStudyItemBase {
    id: string;
    type: CaseStudyType;
    description: string;
    destination: CaseStudyDestination;
    logo?: string[];
    signature?: Signature;
    platforms?: CasePlatform[];
    media?: Media;
    featuredOnMainPage?: boolean;
    slug?: string;
    externalLinkText?: string;
}

export interface ExternalDestinationCaseStudyItem extends CaseStudyItemBase {
    destination: 'external';
    // required when destination === 'external'
    externalLink: string;
}

export interface InternalDestinationCaseStudyItem extends CaseStudyItemBase {
    destination: 'internal';
    // required when destination === 'internal'
    pageContentPath: string;
}

export type CaseStudyItem =
    | ExternalDestinationCaseStudyItem
    | InternalDestinationCaseStudyItem;

export function isExternalCaseStudy(item: CaseStudyItem): item is ExternalDestinationCaseStudyItem {
    return item.destination === 'external';
}