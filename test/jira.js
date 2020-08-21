const chai = require('chai')
  .use(require('chai-as-promised'))
  .use(require('sinon-chai'));
const Jira = require('../services/jira');
require('dotenv').config();

const {
  expect,
} = chai;
chai.should();

const host = process.env.HOST;
const email = process.env.EMAIL;
const token = process.env.TOKEN;
const project = process.env.PROJECT;
const version = process.env.VERSION;
const component = process.env.COMPONENT;
const type = process.env.TYPE;

const jira = new Jira({
  host,
  email,
  token,
  project,
  version,
  component,
  type,
});

describe('jira', () => {
  it('init', async () => {
    const { status } = await jira.check();
    expect(status).equal(200);
  });

  it('versions', async () => {
    const { status } = await jira.getVersions();
    expect(status).equal(200);
  });

  it('versionId', async () => {
    const id = await jira.getVersionIdByPrefix();
    expect(id).to.not.equal(null);
  });

  it('create issue', async () => {
    const { status } = await jira.postIssue('title of issue');
    expect(status).to.not.equal(null);
  });
});

describe('jira issue', () => {
  beforeEach(async () => {
    const { data: issue } = await jira.postIssue('title of issue');
    this.issue = issue;
  });

  it('all transitions', async () => {
    const { status } = await jira.getTransitions(this.issue.key);
    expect(status).to.not.equal(null);
  });

  it('transition id', async () => {
    const id = await jira.getTransitionIdByName(this.issue.key, process.env.TRANSITION);
    expect(id).to.not.equal(null);
  });

  it('transit issue', async () => {
    const id = await jira.postTransitIssue(this.issue.key, process.env.TRANSITION);
    expect(id).to.not.equal(null);
  });
});
