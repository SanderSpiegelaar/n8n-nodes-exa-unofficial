import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import packageJson from '../../package.json';

export class Exa implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Exa',
		name: 'exa',
		icon: 'file:logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Semantic web search and research via Exa API',
		defaults: {
			name: 'Exa',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'exaApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.exa.ai',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-exa-integration': 'n8n',
				'User-Agent': `exa-n8n ${packageJson.version}`,
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Answer',
						value: 'answer',
						description: 'Get an AI-generated answer to a query',
					},
					{
						name: 'Content',
						value: 'contents',
						description: 'Get contents from URLs',
					},
					{
						name: 'Find Similar',
						value: 'findSimilar',
						description: 'Find similar links to a given URL',
					},
					{
						name: 'Research',
						value: 'research',
						description: 'Create and manage asynchronous research tasks',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search the web intelligently',
					},
				],
				default: 'search',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['search'],
					},
				},
				options: [
					{
						name: 'Search',
						value: 'search',
						action: 'Search the web',
						description: 'Search the web and optionally extract contents',
						routing: {
							request: {
								method: 'POST',
								url: '/search',
							},
						},
					},
					{
						name: 'Deep Search',
						value: 'deepSearch',
						action: 'Deep search the web',
						description: 'Run a deep or deep-reasoning search with synthesized output',
						routing: {
							request: {
								method: 'POST',
								url: '/search',
							},
						},
					},
				],
				default: 'search',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contents'],
					},
				},
				options: [
					{
						name: 'Get Contents',
						value: 'getContents',
						action: 'Get contents from ur ls',
						description: 'Retrieve contents from a list of URLs',
						routing: {
							request: {
								method: 'POST',
								url: '/contents',
							},
						},
					},
				],
				default: 'getContents',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['findSimilar'],
					},
				},
				options: [
					{
						name: 'Find Similar Links',
						value: 'findSimilar',
						action: 'Find similar links',
						description: 'Find links similar to a given URL',
						routing: {
							request: {
								method: 'POST',
								url: '/findSimilar',
							},
						},
					},
				],
				default: 'findSimilar',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['answer'],
					},
				},
				options: [
					{
						name: 'Get Answer',
						value: 'getAnswer',
						action: 'Get an AI answer',
						description: 'Get an AI-generated answer to a query',
						routing: {
							request: {
								method: 'POST',
								url: '/answer',
							},
						},
					},
				],
				default: 'getAnswer',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['research'],
					},
				},
				options: [
					{
						name: 'Create Task',
						value: 'createTask',
						action: 'Create a research task',
						description: 'Create an asynchronous research task',
						routing: {
							request: {
								method: 'POST',
								url: '/research/v1',
							},
						},
					},
					{
						name: 'Get Task',
						value: 'getTask',
						action: 'Get a research task',
						description: 'Retrieve status and results of a research task',
						routing: {
							request: {
								method: 'GET',
								url: '=/research/v1/{{ $parameter.researchId }}',
							},
						},
					},
					{
						name: 'List Tasks',
						value: 'listTasks',
						action: 'List research tasks',
						description: 'Retrieve a paginated list of research tasks',
						routing: {
							request: {
								method: 'GET',
								url: '/research/v1',
							},
						},
					},
				],
				default: 'createTask',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['search', 'answer'],
					},
				},
				default: '',
				description: 'The search query',
				routing: {
					request: {
						body: {
							query: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Deep Search Type',
				name: 'deepSearchType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['deepSearch'],
					},
				},
				options: [
					{
						name: 'Deep',
						value: 'deep',
						description: 'Deep search with synthesized output (~5s)',
					},
					{
						name: 'Deep Reasoning',
						value: 'deep-reasoning',
						description: 'Full deep search with stronger reasoning (~7s)',
					},
				],
				default: 'deep',
				description: 'The deep search variant to use',
				routing: {
					request: {
						body: {
							type: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['research'],
						operation: ['createTask'],
					},
				},
				default: '',
				description: 'Instructions for what you would like research on',
				typeOptions: {
					rows: 4,
				},
				routing: {
					request: {
						body: {
							instructions: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Research ID',
				name: 'researchId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['research'],
						operation: ['getTask'],
					},
				},
				default: '',
				description: 'The unique identifier of the research request to retrieve',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['findSimilar'],
					},
				},
				default: '',
				description: 'The URL to find similar links for',
				routing: {
					request: {
						body: {
							url: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'URLs',
				name: 'urls',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['contents'],
					},
				},
				default: '',
				description: 'Comma-separated list of URLs to get contents for',
				routing: {
					send: {
						preSend: [
							async function (this, requestOptions) {
								const urls = this.getNodeParameter('urls', 0) as string;
								const urlArray = urls.split(',').map((url) => url.trim());
								requestOptions.body = {
									...(requestOptions.body as object),
									urls: urlArray,
								};
								return requestOptions;
							},
						],
					},
				},
			},
			{
				displayName: 'Search Type',
				name: 'type',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['search'],
					},
				},
				options: [
					{
						name: 'Auto',
						value: 'auto',
						description: 'Intelligently combines neural and other search methods',
					},
					{
						name: 'Deep',
						value: 'deep',
						description: 'Deep search with synthesized output (~5s)',
					},
					{
						name: 'Deep Reasoning',
						value: 'deep-reasoning',
						description: 'Full deep search with stronger reasoning (~7s)',
					},
					{
						name: 'Fast',
						value: 'fast',
						description: 'Streamlined low-latency search',
					},
					{
						name: 'Instant',
						value: 'instant',
						description: 'Lowest latency search optimized for real-time applications',
					},
					{
						name: 'Neural',
						value: 'neural',
						description: 'Embeddings-based semantic search',
					},
				],
				default: 'auto',
				routing: {
					request: {
						body: {
							type: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['deepSearch'],
					},
				},
				options: [
					{
						name: 'Text',
						value: 'text',
						description: 'Get synthesized text output (default)',
					},
					{
						name: 'Structured (JSON Schema)',
						value: 'structured',
						description: 'Get structured object output matching a JSON Schema',
					},
				],
				default: 'text',
				description: 'Choose between plain text or structured JSON output',
			},
			{
				displayName: 'Output Description',
				name: 'outputDescription',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['deepSearch'],
						outputFormat: ['text'],
					},
				},
				default: '',
				description: 'Freeform description of the desired text output format',
				typeOptions: {
					rows: 3,
				},
				routing: {
					send: {
						preSend: [
							async function (this, requestOptions) {
								const desc = this.getNodeParameter('outputDescription', 0) as string;
								if (desc) {
									requestOptions.body = {
										...(requestOptions.body as object),
										outputSchema: { type: 'text', description: desc },
									};
								}
								return requestOptions;
							},
						],
					},
				},
			},
			{
				displayName: 'Output Schema',
				name: 'outputSchema',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['deepSearch'],
						outputFormat: ['structured'],
					},
				},
				default: '',
				description: 'JSON Schema defining the structure of the output object (provide properties/required, type:object is added automatically)',
				routing: {
					send: {
						preSend: [
							async function (this, requestOptions) {
								const raw = this.getNodeParameter('outputSchema', 0) as string;
								if (raw) {
									const parsed = JSON.parse(raw) as Record<string, unknown>;
									requestOptions.body = {
										...(requestOptions.body as object),
										outputSchema: { type: 'object', ...parsed },
									};
								}
								return requestOptions;
							},
						],
					},
				},
			},
			{
				displayName: 'Additional Queries',
				name: 'additionalQueries',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['search'],
						operation: ['deepSearch'],
					},
				},
				default: '',
				description: 'Comma-separated query variations to improve deep search results',
				routing: {
					send: {
						preSend: [
							async function (this, requestOptions) {
								const queries = this.getNodeParameter('additionalQueries', 0) as string;
								if (queries) {
									const queryArray = queries.split(',').map((q) => q.trim());
									requestOptions.body = {
										...(requestOptions.body as object),
										additionalQueries: queryArray,
									};
								}
								return requestOptions;
							},
						],
					},
				},
			},
			{
				displayName: 'Number of Results',
				name: 'numResults',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['search', 'findSimilar'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				default: 10,
				description: 'Number of results to return (max 100)',
				routing: {
					request: {
						body: {
							numResults: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Answer Options',
				name: 'answerOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['answer'],
					},
				},
				options: [
					{
						displayName: 'Include Text',
						name: 'text',
						type: 'boolean',
						default: false,
						description: 'Whether to include full text content in the citation results',
						routing: {
							request: {
								body: {
									text: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Output Schema',
						name: 'outputSchema',
						type: 'json',
						default: '',
						description: 'JSON Schema to enforce structured answer output instead of a plain string',
						routing: {
							request: {
								body: {
									outputSchema: '={{ JSON.parse($value) }}',
								},
							},
						},
					},
					{
						displayName: 'Stream',
						name: 'stream',
						type: 'boolean',
						default: false,
						description: 'Whether to stream the response via Server-Sent Events',
						routing: {
							request: {
								body: {
									stream: '={{ $value }}',
								},
							},
						},
					},
				],
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['research'],
						operation: ['createTask'],
					},
				},
				options: [
					{
						displayName: 'Model',
						name: 'model',
						type: 'options',
						options: [
							{
								name: 'Exa Research Fast',
								value: 'exa-research-fast',
								description: 'Fastest research model',
							},
							{
								name: 'Exa Research',
								value: 'exa-research',
								description: 'Balanced speed and quality',
							},
							{
								name: 'Exa Research Pro',
								value: 'exa-research-pro',
								description: 'Most thorough analysis and stronger reasoning',
							},
						],
						default: 'exa-research',
						description: 'Research model to use',
						routing: {
							request: {
								body: {
									model: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Output Schema',
						name: 'outputSchema',
						type: 'json',
						default: '',
						description: 'JSON Schema to enforce structured output',
						routing: {
							request: {
								body: {
									outputSchema: '={{ JSON.parse($value) }}',
								},
							},
						},
					},
				],
			},
			{
				displayName: 'Query Options',
				name: 'queryOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['research'],
						operation: ['getTask'],
					},
				},
				options: [
					{
						displayName: 'Stream',
						name: 'stream',
						type: 'boolean',
						default: false,
						description: 'Whether to receive real-time updates via Server-Sent Events (SSE)',
						routing: {
							request: {
								qs: {
									stream: '={{ $value ? "true" : undefined }}',
								},
							},
						},
					},
					{
						displayName: 'Events',
						name: 'events',
						type: 'boolean',
						default: false,
						description: 'Whether to include the detailed event log of all operations performed',
						routing: {
							request: {
								qs: {
									events: '={{ $value ? "true" : undefined }}',
								},
							},
						},
					},
				],
			},
			{
				displayName: 'List Options',
				name: 'listOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['research'],
						operation: ['listTasks'],
					},
				},
				options: [
					{
						displayName: 'Cursor',
						name: 'cursor',
						type: 'string',
						default: '',
						description: 'The cursor to paginate through the results',
						routing: {
							request: {
								qs: {
									cursor: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 50,
						typeOptions: {
							minValue: 1,
						},
						description: 'Max number of results to return',
						routing: {
							request: {
								qs: {
									limit: '={{ $value }}',
								},
							},
						},
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['search'],
					},
				},
				options: [
					{
						displayName: 'Category',
						name: 'category',
						type: 'options',
						options: [
							{ name: 'Company', value: 'company' },
							{ name: 'Financial Report', value: 'financial report' },
							{ name: 'News', value: 'news' },
							{ name: 'People', value: 'people' },
							{ name: 'Personal Site', value: 'personal site' },
							{ name: 'Research Paper', value: 'research paper' },
							{ name: 'Tweet', value: 'tweet' },
						],
						default: 'company',
						description: 'A data category to focus on',
						routing: {
							request: {
								body: {
									category: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'End Crawl Date',
						name: 'endCrawlDate',
						type: 'dateTime',
						default: '',
						description: 'Only return links crawled by Exa before this date',
						routing: {
							request: {
								body: {
									endCrawlDate: '={{ new Date($value).toISOString() }}',
								},
							},
						},
					},
					{
						displayName: 'End Published Date',
						name: 'endPublishedDate',
						type: 'dateTime',
						default: '',
						description: 'Only return links published before this date',
						routing: {
							request: {
								body: {
									endPublishedDate: '={{ new Date($value).toISOString() }}',
								},
							},
						},
					},
					{
						displayName: 'Exclude Domains',
						name: 'excludeDomains',
						type: 'string',
						default: '',
						description: 'Comma-separated list of domains to exclude',
						routing: {
							send: {
								preSend: [
									async function (this, requestOptions) {
										const domains = this.getNodeParameter('additionalFields.excludeDomains', 0) as string;
										if (domains) {
											const domainArray = domains.split(',').map((d) => d.trim());
											requestOptions.body = {
												...(requestOptions.body as object),
												excludeDomains: domainArray,
											};
										}
										return requestOptions;
									},
								],
							},
						},
					},
					{
						displayName: 'Exclude Text',
						name: 'excludeText',
						type: 'string',
						default: '',
						description: 'Text that must not be present in webpage (comma-separated, max 5 words each)',
						routing: {
							send: {
								preSend: [
									async function (this, requestOptions) {
										const text = this.getNodeParameter('additionalFields.excludeText', 0) as string;
										if (text) {
											const textArray = text.split(',').map((t) => t.trim());
											requestOptions.body = {
												...(requestOptions.body as object),
												excludeText: textArray,
											};
										}
										return requestOptions;
									},
								],
							},
						},
					},
					{
						displayName: 'Include Domains',
						name: 'includeDomains',
						type: 'string',
						default: '',
						description: 'Comma-separated list of domains to include (e.g., arxiv.org, github.com)',
						routing: {
							send: {
								preSend: [
									async function (this, requestOptions) {
										const domains = this.getNodeParameter('additionalFields.includeDomains', 0) as string;
										if (domains) {
											const domainArray = domains.split(',').map((d) => d.trim());
											requestOptions.body = {
												...(requestOptions.body as object),
												includeDomains: domainArray,
											};
										}
										return requestOptions;
									},
								],
							},
						},
					},
					{
						displayName: 'Include Text',
						name: 'includeText',
						type: 'string',
						default: '',
						description: 'Text that must be present in webpage (comma-separated, max 5 words each)',
						routing: {
							send: {
								preSend: [
									async function (this, requestOptions) {
										const text = this.getNodeParameter('additionalFields.includeText', 0) as string;
										if (text) {
											const textArray = text.split(',').map((t) => t.trim());
											requestOptions.body = {
												...(requestOptions.body as object),
												includeText: textArray,
											};
										}
										return requestOptions;
									},
								],
							},
						},
					},
					{
						displayName: 'Moderation',
						name: 'moderation',
						type: 'boolean',
						default: false,
						description: 'Whether to enable content moderation to filter unsafe results',
						routing: {
							request: {
								body: {
									moderation: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Start Crawl Date',
						name: 'startCrawlDate',
						type: 'dateTime',
						default: '',
						description: 'Only return links crawled by Exa after this date',
						routing: {
							request: {
								body: {
									startCrawlDate: '={{ new Date($value).toISOString() }}',
								},
							},
						},
					},
					{
						displayName: 'Start Published Date',
						name: 'startPublishedDate',
						type: 'dateTime',
						default: '',
						description: 'Only return links published after this date',
						routing: {
							request: {
								body: {
									startPublishedDate: '={{ new Date($value).toISOString() }}',
								},
							},
						},
					},
					{
						displayName: 'User Location',
						name: 'userLocation',
						type: 'string',
						default: '',
						description: 'Two-letter ISO country code (e.g., US, GB)',
						routing: {
							request: {
								body: {
									userLocation: '={{ $value }}',
								},
							},
						},
					},
				],
			},
			{
				displayName: 'Contents Options',
				name: 'contentsOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['search', 'contents', 'findSimilar'],
					},
				},
				routing: {
					send: {
						preSend: [
							async function (this, requestOptions) {
								const contentsOptions = this.getNodeParameter('contentsOptions', 0, {}) as {
									text?: boolean;
									textMaxCharacters?: number;
									textIncludeHtmlTags?: boolean;
									highlights?: boolean;
									highlightsMaxCharacters?: number;
									highlightsQuery?: string;
									summary?: boolean;
									summaryQuery?: string;
									livecrawl?: string;
									livecrawlTimeout?: number;
									maxAgeHours?: number;
									subpages?: number;
									subpageTarget?: string;
									links?: number;
									imageLinks?: number;
								};

								const contents: Record<string, unknown> = {};

								// Text: send as object when advanced options are present
								const hasTextAdvanced =
									(contentsOptions.textMaxCharacters !== undefined && contentsOptions.textMaxCharacters > 0) ||
									contentsOptions.textIncludeHtmlTags === true;
								if (hasTextAdvanced) {
									const textObj: Record<string, unknown> = {};
									if (contentsOptions.textMaxCharacters !== undefined && contentsOptions.textMaxCharacters > 0) {
										textObj.maxCharacters = contentsOptions.textMaxCharacters;
									}
									if (contentsOptions.textIncludeHtmlTags === true) {
										textObj.includeHtmlTags = true;
									}
									contents.text = textObj;
								} else if (contentsOptions.text !== undefined) {
									contents.text = contentsOptions.text;
								}

								// Highlights: send as object when advanced options are present
								const hasHighlightsAdvanced =
									(contentsOptions.highlightsMaxCharacters !== undefined && contentsOptions.highlightsMaxCharacters > 0) ||
									(contentsOptions.highlightsQuery !== undefined && contentsOptions.highlightsQuery !== '');
								if (hasHighlightsAdvanced) {
									const hlObj: Record<string, unknown> = {};
									if (contentsOptions.highlightsMaxCharacters !== undefined && contentsOptions.highlightsMaxCharacters > 0) {
										hlObj.maxCharacters = contentsOptions.highlightsMaxCharacters;
									}
									if (contentsOptions.highlightsQuery !== undefined && contentsOptions.highlightsQuery !== '') {
										hlObj.query = contentsOptions.highlightsQuery;
									}
									contents.highlights = hlObj;
								} else if (contentsOptions.highlights !== undefined) {
									contents.highlights = contentsOptions.highlights;
								}

								// Summary: send as object when query is present
								if (contentsOptions.summaryQuery !== undefined && contentsOptions.summaryQuery !== '') {
									contents.summary = { query: contentsOptions.summaryQuery };
								} else if (contentsOptions.summary !== undefined) {
									contents.summary = contentsOptions.summary;
								}

								if (contentsOptions.livecrawl !== undefined) {
									contents.livecrawl = contentsOptions.livecrawl;
								}
								if (contentsOptions.livecrawlTimeout !== undefined && contentsOptions.livecrawlTimeout > 0) {
									contents.livecrawlTimeout = contentsOptions.livecrawlTimeout;
								}
								if (contentsOptions.maxAgeHours !== undefined) {
									contents.maxAgeHours = contentsOptions.maxAgeHours;
								}
								if (contentsOptions.subpages !== undefined && contentsOptions.subpages > 0) {
									contents.subpages = contentsOptions.subpages;
								}
								if (contentsOptions.subpageTarget !== undefined && contentsOptions.subpageTarget !== '') {
									contents.subpageTarget = contentsOptions.subpageTarget;
								}

								const extras: Record<string, unknown> = {};
								if (contentsOptions.links !== undefined && contentsOptions.links > 0) {
									extras.links = contentsOptions.links;
								}
								if (contentsOptions.imageLinks !== undefined && contentsOptions.imageLinks > 0) {
									extras.imageLinks = contentsOptions.imageLinks;
								}
								if (Object.keys(extras).length > 0) {
									contents.extras = extras;
								}

									if (Object.keys(contents).length > 0) {
										const resource = this.getNodeParameter('resource', 0) as string;
										if (resource === 'contents') {
											// /contents endpoint expects options at top level
											requestOptions.body = {
												...(requestOptions.body as object),
												...contents,
											};
										} else {
											// /search and /findSimilar nest under contents
											requestOptions.body = {
												...(requestOptions.body as object),
												contents,
											};
										}
									}

								return requestOptions;
							},
						],
					},
				},
				options: [
					{
						displayName: 'Highlights',
						name: 'highlights',
						type: 'boolean',
						default: false,
						description: 'Whether to include highlighted excerpts',
					},
					{
						displayName: 'Highlights Max Characters',
						name: 'highlightsMaxCharacters',
						type: 'number',
						default: 0,
						typeOptions: { minValue: 0 },
						description: 'Maximum characters for highlights (overrides the boolean toggle when > 0)',
					},
					{
						displayName: 'Highlights Query',
						name: 'highlightsQuery',
						type: 'string',
						default: '',
						description: 'Custom query to direct highlight selection',
					},
					{
						displayName: 'Image Links',
						name: 'imageLinks',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: 0,
							maxValue: 10,
						},
						description: 'Number of image URLs to return per result (0-10)',
					},
					{
						displayName: 'Links',
						name: 'links',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: 0,
							maxValue: 10,
						},
						description: 'Number of outgoing URLs to return from each webpage (0-10)',
					},
					{
						displayName: 'Livecrawl (Deprecated)',
						name: 'livecrawl',
						type: 'options',
						options: [
							{ name: 'Always', value: 'always' },
							{ name: 'Preferred', value: 'preferred' },
							{ name: 'Fallback', value: 'fallback' },
							{ name: 'Never', value: 'never' },
						],
						default: 'fallback',
						description: 'Deprecated: use Max Age Hours instead. Controls when to crawl pages in real-time.',
					},
					{
						displayName: 'Livecrawl Timeout',
						name: 'livecrawlTimeout',
						type: 'number',
						default: 10000,
						typeOptions: { minValue: 1000 },
						description: 'Timeout for livecrawling in milliseconds',
					},
					{
						displayName: 'Max Age Hours',
						name: 'maxAgeHours',
						type: 'number',
						default: 24,
						typeOptions: { minValue: -1 },
						description: 'Max age of cached content in hours. 0 = always livecrawl, -1 = always use cache, 24 = recommended default.',
					},
					{
						displayName: 'Subpage Target',
						name: 'subpageTarget',
						type: 'string',
						default: '',
						description: 'Keyword(s) to find specific subpages (e.g., "sources", "references")',
					},
					{
						displayName: 'Subpages',
						name: 'subpages',
						type: 'number',
						default: 0,
						typeOptions: {
							minValue: 0,
							maxValue: 10,
						},
						description: 'Number of subpages to crawl (0-10)',
					},
					{
						displayName: 'Summary',
						name: 'summary',
						type: 'boolean',
						default: false,
						description: 'Whether to include an AI-generated summary',
					},
					{
						displayName: 'Summary Query',
						name: 'summaryQuery',
						type: 'string',
						default: '',
						description: 'Custom query for the LLM-generated summary (overrides the boolean toggle)',
					},
					{
						displayName: 'Text',
						name: 'text',
						type: 'boolean',
						default: false,
						description: 'Whether to include cleaned text from the page',
					},
					{
						displayName: 'Text Include HTML Tags',
						name: 'textIncludeHtmlTags',
						type: 'boolean',
						default: false,
						description: 'Whether to include HTML tags in text output for structure understanding',
					},
					{
						displayName: 'Text Max Characters',
						name: 'textMaxCharacters',
						type: 'number',
						default: 0,
						typeOptions: { minValue: 0 },
						description: 'Maximum characters for text content (0 = no limit, overrides the boolean toggle when > 0)',
					},
				],
			},
		],
	};
}
