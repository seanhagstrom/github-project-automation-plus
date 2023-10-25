import test from 'ava';
import {generateProjectQuery} from '../src/generate-project-query.js';

const issueQuery = `query {
	resource( url: "https://github.com/seanhagstrom/test-actions/issues/1" ) {
		... on Issue {
			projectCards: projectItems(first: 100) {
				nodes {
					id
					isArchived
					project {
						name: title
						id
					}
				}
			}
			repository {
				projects: projectsV2(query: "title: test", first: 10) {
					nodes {
						name: title
						id
						columns: field(name: "Status") {
							... on ProjectV2SingleSelectField {
								fieldId: id
								options {
									id
									name
								}
							}
						}
					}
				}
				owner {
					... on ProjectV2Owner {
						projects: projectsV2(query: "title: test", first: 10) {
							nodes {
								name: title
								id
								columns: field(name: "Status") {
									... on ProjectV2SingleSelectField {
										fieldId: id
										options {
											id
											name
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
}`;

const pullrequestQuery = `query {
	resource( url: "https://github.com/alex-page/test-actions/pulls/1" ) {
		... on PullRequest {
			projectCards {
				nodes {
					id
					isArchived
					project {
						name
						id
					}
				}
			}
			repository {
				projects( search: "Backlogg", first: 10, states: [OPEN] ) {
					nodes {
						name
						id
						columns( first: 100 ) {
							nodes {
								id
								name
							}
						}
					}
				}
				owner {
					... on ProjectOwner {
						projects( search: "Backlogg", first: 10, states: [OPEN] ) {
							nodes {
								name
								id
								columns( first: 100 ) {
									nodes {
										id
										name
									}
								}
							}
						}
					}
				}
			}
		}
	}
}`;

test('generateProjectQuery should create a query for issues', t => {
const url = 'https://github.com/seanhagstrom/test-actions/issues/1';
const eventName = 'issues';
const project = 'test';
t.is(generateProjectQuery(url, eventName, project), issueQuery);

});

// test('generateProjectQuery should create a query for pull requests', t => {
// const url = 'https://github.com/seanhagstrom/test-actions/pulls/1';
// const eventName = 'pull_request';
// const project = 'test';

// t.is(generateProjectQuery(url, eventName, project), pullrequestQuery);
// });
