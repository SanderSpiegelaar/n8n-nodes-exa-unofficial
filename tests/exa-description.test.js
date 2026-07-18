const test = require('node:test');
const assert = require('node:assert/strict');
const { existsSync } = require('node:fs');
const { ExaUnofficial } = require('../dist/nodes/Exa/ExaUnofficial.node');
const { ExaUnofficialApi } = require('../dist/credentials/ExaUnofficialApi.credentials');
const nodeCodex = require('../dist/nodes/Exa/ExaUnofficial.node.json');
const packageJson = require('../package.json');

const description = new ExaUnofficial().description;
const properties = description.properties;

function operation(value) {
	return properties
		.filter((property) => property.name === 'operation')
		.flatMap((property) => property.options || [])
		.find((option) => option.value === value && option.routing?.request?.url);
}

test('uses unique unofficial package, node, and credential identifiers', () => {
	const credential = new ExaUnofficialApi();
	assert.equal(packageJson.name, 'n8n-nodes-exa-unofficial');
	assert.ok(existsSync(packageJson.main));
	assert.ok(existsSync(packageJson.types));
	assert.ok(packageJson.n8n.nodes.every(existsSync));
	assert.ok(packageJson.n8n.credentials.every(existsSync));
	assert.equal(nodeCodex.node, 'n8n-nodes-exa-unofficial');
	assert.equal(description.displayName, 'Exa (Unofficial)');
	assert.equal(description.name, 'exaUnofficial');
	assert.equal(description.defaults.name, 'Exa (Unofficial)');
	assert.equal(description.credentials[0].name, 'exaUnofficialApi');
	assert.equal(credential.name, 'exaUnofficialApi');
	assert.equal(credential.displayName, 'Exa (Unofficial) API');
});

test('exposes Agent and Websets resources', () => {
	const resource = properties.find((property) => property.name === 'resource');
	assert.deepEqual(
		resource.options
			.filter((option) => ['agent', 'websets'].includes(option.value))
			.map((option) => option.value),
		['agent', 'websets'],
	);
});

test('covers Agent HTTP paths', () => {
	const expected = {
		createRun: ['POST', '/agent/runs'],
		getRun: ['GET', '=/agent/runs/{{$parameter.runId}}'],
		listRuns: ['GET', '/agent/runs'],
		cancelRun: ['POST', '=/agent/runs/{{$parameter.runId}}/cancel'],
		deleteRun: ['DELETE', '=/agent/runs/{{$parameter.runId}}'],
		listRunEvents: ['GET', '=/agent/runs/{{$parameter.runId}}/events'],
	};
	for (const [name, [method, url]] of Object.entries(expected)) {
		const option = operation(name);
		assert.equal(option.routing.request.method, method);
		assert.equal(option.routing.request.url, url);
	}
});

test('covers Websets v0 HTTP paths', () => {
	const expected = {
		createWebset: ['POST', '/websets/v0/websets'],
		previewWebset: ['POST', '/websets/v0/websets/preview'],
		getWebset: ['GET', '=/websets/v0/websets/{{$parameter.websetId}}'],
		listWebsets: ['GET', '/websets/v0/websets'],
		updateWebset: ['POST', '=/websets/v0/websets/{{$parameter.websetId}}'],
		cancelWebset: ['POST', '=/websets/v0/websets/{{$parameter.websetId}}/cancel'],
		deleteWebset: ['DELETE', '=/websets/v0/websets/{{$parameter.websetId}}'],
		createWebsetSearch: ['POST', '=/websets/v0/websets/{{$parameter.websetId}}/searches'],
		getWebsetSearch: [
			'GET',
			'=/websets/v0/websets/{{$parameter.websetId}}/searches/{{$parameter.websetSearchId}}',
		],
		cancelWebsetSearch: [
			'POST',
			'=/websets/v0/websets/{{$parameter.websetId}}/searches/{{$parameter.websetSearchId}}/cancel',
		],
		listWebsetItems: ['GET', '=/websets/v0/websets/{{$parameter.websetId}}/items'],
		getWebsetItem: [
			'GET',
			'=/websets/v0/websets/{{$parameter.websetId}}/items/{{$parameter.websetItemId}}',
		],
		deleteWebsetItem: [
			'DELETE',
			'=/websets/v0/websets/{{$parameter.websetId}}/items/{{$parameter.websetItemId}}',
		],
		createEnrichment: ['POST', '=/websets/v0/websets/{{$parameter.websetId}}/enrichments'],
		getEnrichment: [
			'GET',
			'=/websets/v0/websets/{{$parameter.websetId}}/enrichments/{{$parameter.enrichmentId}}',
		],
		updateEnrichment: [
			'PATCH',
			'=/websets/v0/websets/{{$parameter.websetId}}/enrichments/{{$parameter.enrichmentId}}',
		],
		cancelEnrichment: [
			'POST',
			'=/websets/v0/websets/{{$parameter.websetId}}/enrichments/{{$parameter.enrichmentId}}/cancel',
		],
		deleteEnrichment: [
			'DELETE',
			'=/websets/v0/websets/{{$parameter.websetId}}/enrichments/{{$parameter.enrichmentId}}',
		],
		createExport: ['POST', '=/websets/v0/websets/{{$parameter.websetId}}/exports'],
		getExport: [
			'GET',
			'=/websets/v0/websets/{{$parameter.websetId}}/exports/{{$parameter.exportId}}',
		],
	};
	const values = Object.keys(expected);
	const options = values.map(operation);
	assert.equal(options.length, 20);
	for (const [name, [method, url]] of Object.entries(expected)) {
		const option = operation(name);
		assert.equal(option.routing.request.method, method);
		assert.equal(option.routing.request.url, url);
	}
});

test('uses documented Agent and Webset option enums', () => {
	const field = (name) => properties.find((property) => property.name === name);
	const values = (name) => field(name).options.map((option) => option.value);
	assert.deepEqual(values('agentEffort'), ['auto', 'minimal', 'low', 'medium', 'high', 'xhigh']);
	assert.deepEqual(values('dataSources'), [
		'affiliate',
		'baselayer',
		'fiber',
		'financial_datasets',
		'jinko',
		'particle',
		'similarweb',
	]);
	assert.deepEqual(values('websetEntity'), [
		'company',
		'person',
		'article',
		'research_paper',
		'custom',
	]);
	assert.deepEqual(values('websetSearchEntity'), [
		'company',
		'person',
		'article',
		'research_paper',
		'custom',
	]);
	assert.deepEqual(values('enrichmentFormat'), [
		'text',
		'date',
		'number',
		'options',
		'email',
		'phone',
		'url',
	]);
});

test('transforms selected data sources into provider objects', async () => {
	const field = properties.find((property) => property.name === 'dataSources');
	const preSend = field.routing.send.preSend[0];
	const request = await preSend.call(
		{ getNodeParameter: () => ['fiber', 'particle'] },
		{ body: { query: 'test' } },
	);
	assert.deepEqual(request.body, {
		query: 'test',
		dataSources: [{ provider: 'fiber' }, { provider: 'particle' }],
	});
});

test('transforms custom Webset entity into documented object', async () => {
	const field = properties.find((property) => property.name === 'websetQuery');
	const preSend = field.routing.send.preSend[0];
	const params = {
		websetQuery: 'find companies',
		websetCount: 10,
		websetCriteria: '',
		websetEnrichments: '',
		websetMetadata: '',
		websetEntity: 'custom',
		websetCustomEntityDescription: 'AI laboratories',
		websetTitle: '',
		externalId: '',
	};
	const request = await preSend.call({ getNodeParameter: (name) => params[name] }, {});
	assert.deepEqual(request.body.search.entity, {
		type: 'custom',
		description: 'AI laboratories',
	});
});

test('uses documented enrichment request field names', () => {
	const options = properties.find((property) => property.name === 'enrichmentOptions');
	const metadata = properties.find((property) => property.name === 'enrichmentMetadata');
	assert.match(options.description, /sent as options$/);
	assert.match(metadata.description, /sent as metadata$/);
});
