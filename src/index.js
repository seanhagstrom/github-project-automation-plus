import * as core from '@actions/core';
import * as github from '@actions/github';
import {getActionData} from './get-action-data.js';
import {generateProjectQuery} from './generate-project-query.js';
import {generateMutationQuery} from './generate-mutation-query.js';

async function main() {
	try {
		const token = core.getInput('repo-token');
		const project = core.getInput('project');
		const column = core.getInput('column');
		const action = core.getInput('action') || 'update';

		// Get data from the current action
		const {eventName, nodeId, url} = getActionData(github.context);
console.log('project url: ')
console.log(url)
		// Create a method to query GitHub
		// const octokit = new github.GitHub(token);
		const octokit = new github.getOctokit(token);

		// Get the column ID from searching for the project and card Id if it exists
		const projectQuery = generateProjectQuery(url, eventName, project);

		console.log(`projectQuery: ${projectQuery}`)

		core.debug(projectQuery);

		console.log(octokit.graphql)

		const {resource} = await octokit.graphql(projectQuery);

		console.log('project cards: ')
		console.log(resource.projectCards)
		console.log('repository: ')
		console.log(resource.repository)


		core.debug(JSON.stringify(resource));

		// A list of columns that line up with the user entered project and column
		const mutationQueries = generateMutationQuery(resource, project, column, nodeId, action);
		if ((action === 'delete' || action === 'archive' || action === 'add') && mutationQueries.length === 0) {
			console.log('✅ There is nothing to do with card');
			return;
		}

		core.debug(mutationQueries.join('\n'));

		// Run the graphql queries
		await Promise.all(mutationQueries.map(query => octokit.graphql(query)));

		if (mutationQueries.length > 1) {
			console.log(`✅ Card materialised into to ${column} in ${mutationQueries.length} projects called ${project}`);
		} else {
			console.log(`✅ Card materialised into ${column} in ${project}`);
		}
	} catch (error) {
		core.setFailed(error.message);
	}
}

await main();
