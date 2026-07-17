/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items */
/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-limit */
/* eslint-disable n8n-nodes-base/node-param-type-options-max-value-present */
import { INodeProperties } from 'n8n-workflow';

type DisplayOptions = NonNullable<INodeProperties['displayOptions']>['show'];

function parseJson(value: string, name: string): unknown {
	try {
		return JSON.parse(value);
	} catch {
		throw new Error(`${name} must contain valid JSON`);
	}
}

function jsonField(
	name: string,
	displayName: string,
	show: DisplayOptions,
	bodyName = name,
	route = true,
): INodeProperties {
	return {
		displayName,
		name,
		type: 'json',
		default: '',
		displayOptions: { show },
		description: `JSON value sent as ${bodyName}`,
		...(route && {
			routing: {
				send: {
					preSend: [
						async function (this, requestOptions) {
							const value = this.getNodeParameter(name, 0) as string;
							if (value)
								requestOptions.body = {
									...(requestOptions.body as object),
									[bodyName]: parseJson(value, displayName),
								};
							return requestOptions;
						},
					],
				},
			},
		}),
	};
}

function idField(name: string, displayName: string, show: DisplayOptions): INodeProperties {
	return {
		displayName,
		name,
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show },
		description: 'Use an expression to reference an ID from a previous operation',
	};
}

function pageFields(show: DisplayOptions): INodeProperties[] {
	return [
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			typeOptions: {
				minValue: 1,
				maxValue: 100,
			},
			description: 'Max number of results to return',
			default: 20,
			displayOptions: { show },
			routing: { request: { qs: { limit: '={{ $value }}' } } },
		},
		{
			displayName: 'Cursor',
			name: 'cursor',
			type: 'string',
			default: '',
			displayOptions: { show },
			routing: { request: { qs: { cursor: '={{ $value }}' } } },
		},
	];
}

const agentCreate = { resource: ['agent'], operation: ['createRun'] };
const websetCreate = { resource: ['websets'], operation: ['createWebset', 'previewWebset'] };
const searchCreate = { resource: ['websets'], operation: ['createWebsetSearch'] };

export const agentWebsetsProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'createRun',
		displayOptions: { show: { resource: ['agent'] } },
		options: [
			{
				name: 'Create Run',
				value: 'createRun',
				action: 'Create an agent run',
				routing: { request: { method: 'POST', url: '/agent/runs' } },
			},
			{
				name: 'Get Run',
				value: 'getRun',
				action: 'Get an agent run',
				routing: { request: { method: 'GET', url: '=/agent/runs/{{$parameter.runId}}' } },
			},
			{
				name: 'List Runs',
				value: 'listRuns',
				action: 'List agent runs',
				routing: { request: { method: 'GET', url: '/agent/runs' } },
			},
			{
				name: 'Cancel Run',
				value: 'cancelRun',
				action: 'Cancel an agent run',
				routing: { request: { method: 'POST', url: '=/agent/runs/{{$parameter.runId}}/cancel' } },
			},
			{
				name: 'Delete Run',
				value: 'deleteRun',
				action: 'Delete an agent run',
				routing: { request: { method: 'DELETE', url: '=/agent/runs/{{$parameter.runId}}' } },
			},
			{
				name: 'List Run Events',
				value: 'listRunEvents',
				action: 'List agent run events',
				description:
					'Returns JSON event history; SSE streaming is not supported by n8n node execution',
				routing: {
					request: {
						method: 'GET',
						url: '=/agent/runs/{{$parameter.runId}}/events',
						headers: { Accept: 'application/json' },
					},
				},
			},
		],
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'createWebset',
		displayOptions: { show: { resource: ['websets'] } },
		options: [
			{
				name: 'Create Webset',
				value: 'createWebset',
				action: 'Create a webset',
				routing: { request: { method: 'POST', url: '/websets/v0/websets' } },
			},
			{
				name: 'Preview Webset',
				value: 'previewWebset',
				action: 'Preview a webset',
				routing: { request: { method: 'POST', url: '/websets/v0/websets/preview' } },
			},
			{
				name: 'Get Webset',
				value: 'getWebset',
				action: 'Get a webset',
				routing: {
					request: { method: 'GET', url: '=/websets/v0/websets/{{$parameter.websetId}}' },
				},
			},
			{
				name: 'List Websets',
				value: 'listWebsets',
				action: 'List websets',
				routing: { request: { method: 'GET', url: '/websets/v0/websets' } },
			},
			{
				name: 'Update Webset',
				value: 'updateWebset',
				action: 'Update a webset',
				routing: {
					request: { method: 'POST', url: '=/websets/v0/websets/{{$parameter.websetId}}' },
				},
			},
			{
				name: 'Cancel Webset',
				value: 'cancelWebset',
				action: 'Cancel a webset',
				routing: {
					request: { method: 'POST', url: '=/websets/v0/websets/{{$parameter.websetId}}/cancel' },
				},
			},
			{
				name: 'Delete Webset',
				value: 'deleteWebset',
				action: 'Delete a webset',
				routing: {
					request: { method: 'DELETE', url: '=/websets/v0/websets/{{$parameter.websetId}}' },
				},
			},
			{
				name: 'Create Search',
				value: 'createWebsetSearch',
				action: 'Create a webset search',
				routing: {
					request: { method: 'POST', url: '=/websets/v0/websets/{{$parameter.websetId}}/searches' },
				},
			},
			{
				name: 'Get Search',
				value: 'getWebsetSearch',
				action: 'Get a webset search',
				routing: {
					request: {
						method: 'GET',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/searches/{{$parameter.websetSearchId}}',
					},
				},
			},
			{
				name: 'Cancel Search',
				value: 'cancelWebsetSearch',
				action: 'Cancel a webset search',
				routing: {
					request: {
						method: 'POST',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/searches/{{$parameter.websetSearchId}}/cancel',
					},
				},
			},
			{
				name: 'List Items',
				value: 'listWebsetItems',
				action: 'List webset items',
				routing: {
					request: { method: 'GET', url: '=/websets/v0/websets/{{$parameter.websetId}}/items' },
				},
			},
			{
				name: 'Get Item',
				value: 'getWebsetItem',
				action: 'Get a webset item',
				routing: {
					request: {
						method: 'GET',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/items/{{$parameter.websetItemId}}',
					},
				},
			},
			{
				name: 'Delete Item',
				value: 'deleteWebsetItem',
				action: 'Delete a webset item',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/items/{{$parameter.websetItemId}}',
					},
				},
			},
			{
				name: 'Create Enrichment',
				value: 'createEnrichment',
				action: 'Create a webset enrichment',
				routing: {
					request: {
						method: 'POST',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/enrichments',
					},
				},
			},
			{
				name: 'Get Enrichment',
				value: 'getEnrichment',
				action: 'Get a webset enrichment',
				routing: {
					request: {
						method: 'GET',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/enrichments/{{$parameter.enrichmentId}}',
					},
				},
			},
			{
				name: 'Update Enrichment',
				value: 'updateEnrichment',
				action: 'Update a webset enrichment',
				routing: {
					request: {
						method: 'PATCH',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/enrichments/{{$parameter.enrichmentId}}',
					},
				},
			},
			{
				name: 'Cancel Enrichment',
				value: 'cancelEnrichment',
				action: 'Cancel a webset enrichment',
				routing: {
					request: {
						method: 'POST',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/enrichments/{{$parameter.enrichmentId}}/cancel',
					},
				},
			},
			{
				name: 'Delete Enrichment',
				value: 'deleteEnrichment',
				action: 'Delete a webset enrichment',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/enrichments/{{$parameter.enrichmentId}}',
					},
				},
			},
			{
				name: 'Create Export',
				value: 'createExport',
				action: 'Create a webset export',
				routing: {
					request: { method: 'POST', url: '=/websets/v0/websets/{{$parameter.websetId}}/exports' },
				},
			},
			{
				name: 'Get Export',
				value: 'getExport',
				action: 'Get a webset export',
				routing: {
					request: {
						method: 'GET',
						url: '=/websets/v0/websets/{{$parameter.websetId}}/exports/{{$parameter.exportId}}',
					},
				},
			},
		],
	},
	{
		displayName: 'Query',
		name: 'agentQuery',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: agentCreate },
		routing: { request: { body: { query: '={{ $value }}' } } },
	},
	{
		displayName: 'Effort',
		name: 'agentEffort',
		type: 'options',
		default: 'auto',
		displayOptions: { show: agentCreate },
		options: [
			{ name: 'Auto', value: 'auto' },
			{ name: 'Minimal', value: 'minimal' },
			{ name: 'Low', value: 'low' },
			{ name: 'Medium', value: 'medium' },
			{ name: 'High', value: 'high' },
			{ name: 'Extra High', value: 'xhigh' },
		],
		routing: { request: { body: { effort: '={{ $value }}' } } },
	},
	{
		displayName: 'System Prompt',
		name: 'agentSystemPrompt',
		type: 'string',
		default: '',
		displayOptions: { show: agentCreate },
		routing: { request: { body: { systemPrompt: '={{ $value }}' } } },
	},
	{
		displayName: 'Previous Run ID',
		name: 'previousRunId',
		type: 'string',
		default: '',
		displayOptions: { show: agentCreate },
		routing: { request: { body: { previousRunId: '={{ $value }}' } } },
	},
	{
		displayName: 'Data Sources',
		name: 'dataSources',
		type: 'multiOptions',
		default: [],
		displayOptions: { show: agentCreate },
		options: [
			{ name: 'Affiliate', value: 'affiliate' },
			{ name: 'Baselayer', value: 'baselayer' },
			{ name: 'Fiber', value: 'fiber' },
			{ name: 'Financial Datasets', value: 'financial_datasets' },
			{ name: 'Jinko', value: 'jinko' },
			{ name: 'Particle', value: 'particle' },
			{ name: 'Similarweb', value: 'similarweb' },
		],
		routing: {
			send: {
				preSend: [
					async function (this, requestOptions) {
						const providers = this.getNodeParameter('dataSources', 0) as string[];
						requestOptions.body = {
							...(requestOptions.body as object),
							dataSources: providers.map((provider) => ({ provider })),
						};
						return requestOptions;
					},
				],
			},
		},
	},
	jsonField('agentInput', 'Input', agentCreate, 'input'),
	jsonField('agentOutputSchema', 'Output Schema', agentCreate, 'outputSchema'),
	jsonField('agentMetadata', 'Metadata', agentCreate, 'metadata'),
	idField('runId', 'Run ID', {
		resource: ['agent'],
		operation: ['getRun', 'cancelRun', 'deleteRun', 'listRunEvents'],
	}),
	...pageFields({ resource: ['agent'], operation: ['listRuns', 'listRunEvents'] }),
	{
		displayName: 'Query',
		name: 'websetQuery',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: websetCreate },
		description: 'Search query in nested search request',
		routing: {
			send: {
				preSend: [
					async function (this, requestOptions) {
						const criteria = this.getNodeParameter('websetCriteria', 0) as string;
						const enrichments = this.getNodeParameter('websetEnrichments', 0) as string;
						const metadata = this.getNodeParameter('websetMetadata', 0) as string;
						const entity = this.getNodeParameter('websetEntity', 0) as string;
						const customEntityDescription = this.getNodeParameter(
							'websetCustomEntityDescription',
							0,
						) as string;
						const title = this.getNodeParameter('websetTitle', 0) as string;
						const externalId = this.getNodeParameter('externalId', 0) as string;
						requestOptions.body = {
							search: {
								query: this.getNodeParameter('websetQuery', 0),
								count: this.getNodeParameter('websetCount', 0),
								...(entity
									? {
											entity: {
												type: entity,
												...(entity === 'custom' ? { description: customEntityDescription } : {}),
											},
										}
									: {}),
								...(criteria ? { criteria: parseJson(criteria, 'Criteria') } : {}),
							},
							...(enrichments ? { enrichments: parseJson(enrichments, 'Enrichments') } : {}),
							...(metadata ? { metadata: parseJson(metadata, 'Metadata') } : {}),
							...(title ? { title } : {}),
							...(externalId ? { externalId } : {}),
						};
						return requestOptions;
					},
				],
			},
		},
	},
	{
		displayName: 'Count',
		name: 'websetCount',
		type: 'number',
		required: true,
		default: 10,
		typeOptions: { minValue: 1 },
		displayOptions: { show: websetCreate },
	},
	{
		displayName: 'Entity',
		name: 'websetEntity',
		type: 'options',
		default: 'company',
		displayOptions: { show: websetCreate },
		options: [
			{ name: 'Company', value: 'company' },
			{ name: 'Person', value: 'person' },
			{ name: 'Article', value: 'article' },
			{ name: 'Research Paper', value: 'research_paper' },
			{ name: 'Custom', value: 'custom' },
		],
	},
	{
		displayName: 'Custom Entity Description',
		name: 'websetCustomEntityDescription',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...websetCreate, websetEntity: ['custom'] } },
	},
	jsonField('websetCriteria', 'Criteria', websetCreate, 'criteria', false),
	jsonField('websetEnrichments', 'Enrichments', websetCreate, 'enrichments', false),
	jsonField('websetMetadata', 'Metadata', websetCreate, 'metadata', false),
	{
		displayName: 'Title',
		name: 'websetTitle',
		type: 'string',
		default: '',
		displayOptions: { show: websetCreate },
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		displayOptions: { show: websetCreate },
	},
	{
		displayName: 'Webset ID',
		name: 'websetId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['websets'],
				operation: [
					'getWebset',
					'updateWebset',
					'cancelWebset',
					'deleteWebset',
					'createWebsetSearch',
					'getWebsetSearch',
					'cancelWebsetSearch',
					'listWebsetItems',
					'getWebsetItem',
					'deleteWebsetItem',
					'createEnrichment',
					'getEnrichment',
					'updateEnrichment',
					'cancelEnrichment',
					'deleteEnrichment',
					'createExport',
					'getExport',
				],
			},
		},
	},
	{
		displayName: 'Expand Items',
		name: 'expandItems',
		type: 'boolean',
		default: false,
		displayOptions: { show: { resource: ['websets'], operation: ['getWebset'] } },
		routing: {
			send: {
				preSend: [
					async function (this, requestOptions) {
						if (this.getNodeParameter('expandItems', 0) as boolean) {
							requestOptions.qs = { ...(requestOptions.qs as object), 'expand[]': 'items' };
						}
						return requestOptions;
					},
				],
			},
		},
	},
	...pageFields({ resource: ['websets'], operation: ['listWebsets', 'listWebsetItems'] }),
	{
		displayName: 'Source ID',
		name: 'sourceId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['websets'], operation: ['listWebsetItems'] } },
		routing: {
			send: {
				preSend: [
					async function (this, requestOptions) {
						const sourceId = this.getNodeParameter('sourceId', 0) as string;
						if (sourceId) requestOptions.qs = { ...(requestOptions.qs as object), sourceId };
						return requestOptions;
					},
				],
			},
		},
	},
	{
		displayName: 'Title',
		name: 'websetUpdateTitle',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['websets'], operation: ['updateWebset'] } },
		routing: { request: { body: { title: '={{ $value }}' } } },
	},
	jsonField(
		'websetUpdateMetadata',
		'Metadata',
		{ resource: ['websets'], operation: ['updateWebset'] },
		'metadata',
	),
	{
		displayName: 'Query',
		name: 'websetSearchQuery',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: searchCreate },
		routing: {
			send: {
				preSend: [
					async function (this, requestOptions) {
						const criteria = this.getNodeParameter('websetSearchCriteria', 0) as string;
						const advanced = this.getNodeParameter('websetSearchAdvanced', 0) as string;
						const entity = this.getNodeParameter('websetSearchEntity', 0) as string;
						const customEntityDescription = this.getNodeParameter(
							'websetSearchCustomEntityDescription',
							0,
						) as string;
						requestOptions.body = {
							...(advanced ? (parseJson(advanced, 'Advanced Search Body') as object) : {}),
							query: this.getNodeParameter('websetSearchQuery', 0),
							count: this.getNodeParameter('websetSearchCount', 0),
							...(entity
								? {
										entity: {
											type: entity,
											...(entity === 'custom' ? { description: customEntityDescription } : {}),
										},
									}
								: {}),
							...(criteria ? { criteria: parseJson(criteria, 'Criteria') } : {}),
						};
						return requestOptions;
					},
				],
			},
		},
	},
	{
		displayName: 'Count',
		name: 'websetSearchCount',
		type: 'number',
		default: 10,
		displayOptions: { show: searchCreate },
	},
	{
		displayName: 'Entity',
		name: 'websetSearchEntity',
		type: 'options',
		default: 'company',
		displayOptions: { show: searchCreate },
		options: [
			{ name: 'Company', value: 'company' },
			{ name: 'Person', value: 'person' },
			{ name: 'Article', value: 'article' },
			{ name: 'Research Paper', value: 'research_paper' },
			{ name: 'Custom', value: 'custom' },
		],
	},
	{
		displayName: 'Custom Entity Description',
		name: 'websetSearchCustomEntityDescription',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...searchCreate, websetSearchEntity: ['custom'] } },
	},
	jsonField('websetSearchCriteria', 'Criteria', searchCreate, 'criteria', false),
	jsonField(
		'websetSearchAdvanced',
		'Advanced Search Body',
		searchCreate,
		'websetSearchAdvanced',
		false,
	),
	idField('websetSearchId', 'Search ID', {
		resource: ['websets'],
		operation: ['getWebsetSearch', 'cancelWebsetSearch'],
	}),
	idField('websetItemId', 'Item ID', {
		resource: ['websets'],
		operation: ['getWebsetItem', 'deleteWebsetItem'],
	}),
	{
		displayName: 'Description',
		name: 'createEnrichmentDescription',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['websets'], operation: ['createEnrichment'] } },
		routing: { request: { body: { description: '={{ $value }}' } } },
	},
	{
		displayName: 'Description',
		name: 'updateEnrichmentDescription',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['websets'], operation: ['updateEnrichment'] } },
		routing: { request: { body: { description: '={{ $value }}' } } },
	},
	{
		displayName: 'Format',
		name: 'enrichmentFormat',
		type: 'options',
		default: 'text',
		displayOptions: {
			show: { resource: ['websets'], operation: ['createEnrichment', 'updateEnrichment'] },
		},
		options: [
			{ name: 'Text', value: 'text' },
			{ name: 'Date', value: 'date' },
			{ name: 'Number', value: 'number' },
			{ name: 'Options', value: 'options' },
			{ name: 'Email', value: 'email' },
			{ name: 'Phone', value: 'phone' },
			{ name: 'URL', value: 'url' },
		],
		routing: { request: { body: { format: '={{ $value }}' } } },
	},
	jsonField('enrichmentOptions', 'Options', {
		resource: ['websets'],
		operation: ['createEnrichment', 'updateEnrichment'],
		enrichmentFormat: ['options'],
	}, 'options'),
	jsonField('enrichmentMetadata', 'Metadata', {
		resource: ['websets'],
		operation: ['createEnrichment', 'updateEnrichment'],
	}, 'metadata'),
	idField('enrichmentId', 'Enrichment ID', {
		resource: ['websets'],
		operation: ['getEnrichment', 'updateEnrichment', 'cancelEnrichment', 'deleteEnrichment'],
	}),
	{
		displayName: 'Format',
		name: 'exportFormat',
		type: 'options',
		default: 'csv',
		displayOptions: { show: { resource: ['websets'], operation: ['createExport'] } },
		options: [
			{ name: 'CSV', value: 'csv' },
			{ name: 'JSON', value: 'json' },
		],
		routing: { request: { body: { format: '={{ $value }}' } } },
	},
	idField('exportId', 'Export ID', {
		resource: ['websets'],
		operation: ['getExport'],
	}),
];
