import { gql, GraphQLClient } from 'graphql-request';
// import * as Fragments from 'queries/fragments';
import compress from 'graphql-query-compress/lib/graphql-query-compress.browser.js';

export default class ContentfulApi {
	static async callContentful(query: any, variables = {}, preview = false) {
		const client = new GraphQLClient(`https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/master`, {
			headers: {
				Authorization: `Bearer ${preview ? process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN : process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
			},
		});
		try {
			const data = await client.request(compress(query), variables);

			return data;
		} catch (error) {
			throw new Error('Could not fetch data from Contentful');
		}
	}

	static async getAllProducts() {
		const query = gql`
			query {
				productCollection(preview: false) {
					items {
						sys {
							id
						}
						name
						description
						slug
						imageCollection(preview: false) {
							items {
								title
								description
								url
							}
						}
					}
				}
			}
		`;

		const { productCollection } = await this.callContentful(query);

		return productCollection.items;
	}

	static async getNewProducts() {
		const query = gql`
			query {
				productCollection(limit: 6, order: sys_publishedAt_DESC) {
					items {
						sys {
							id
						}
						name
						description
						slug
						imageCollection(preview: false) {
							items {
								title
								description
								url
							}
						}
					}
				}
			}
		`;

		const { productCollection } = await this.callContentful(query);

		return productCollection.items;
	}

	static async getProductBySlug(slug: string) {
		const query = gql`
			query getProductBySlug($slug: String) {
				productCollection(where: { slug: $slug }, limit: 1) {
					items {
						sys {
							id
						}
						name
						description
						sizeList {
							sizes
						}
						seo {
							metaTitle
							metaDescription
							canonicalUrl
							metaImage {
								url
							}
						}
						imageCollection(preview: false, limit: 5) {
							items {
								title
								description
								url
							}
						}
					}
				}
			}
		`;

		const { productCollection } = await this.callContentful(query, {
			slug: slug,
		});

		return productCollection.items[0];
	}

	static async getPageBySlug(slug: string, locale: string, locales: string[]) {
		const query = gql`
			query getPageBySlug($slug: String, $locale: String, $locales: [String]) {
				pageCollection(where: { slug: $slug, availability_contains_some: $locales }, locale: $locale, limit: 1) {
					items {
						name
						slug
						seo {
							metaTitle
							metaDescription
							canonicalUrl
							metaImage {
								url
							}
						}
					}
				}
			}
		`;

		const { pageCollection } = await this.callContentful(query, {
			slug: slug,
			locale: locale,
			locales: locales,
		});

		return pageCollection.items[0];
	}

	static async getAllPages(preview: boolean, locale: string) {
		const query = gql`
			query ($preview: Boolean, $locale: [String]) {
				pageCollection(preview: false, where: { availability_contains_some: $locale, slug_not: "/" }) {
					items {
						name
						slug
						seo {
							metaTitle
							metaDescription
							canonicalUrl
							metaImage {
								url
							}
						}
					}
				}
			}
		`;

		const { pageCollection } = await this.callContentful(query, { preview, locale });

		return pageCollection.items;
	}
}
