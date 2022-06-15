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

		return productCollection.items[0];
	}
}
