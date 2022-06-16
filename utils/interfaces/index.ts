export interface ImageObject {
	title: string;
	description: string;
	url: string;
}

export interface imageCollectionData {
	items: ImageObject[];
}

export interface SEO {
	metaTitle: string;
	metaDescription: string;
	metaImage?: {
		url: string;
	};
	canonicalUrl?: string;
}

export interface Page {
	name: string;
	slug: string;
	seo: SEO;
}
