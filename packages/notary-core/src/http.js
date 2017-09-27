import express from 'express';
import bodyParser from 'body-parser';
import zip from 'express-zip';
import recursive from 'recursive-readdir';
import _ from 'lodash';

import config from './config';
import projectRepository from './projects/project_repository';
import revisionRepository from './projects/project_revision_repository';
import hal from './hal';

const server = express();

server.get('/projects', async (req, res) => {
  const projects = await projectRepository.all();
  const projectsWithMasterRevision = await Promise.all(projects.map(async (project) => {
    return {project, masterRevision: await revisionRepository.findByProjectAndRev(project, 'master')};
  }));
  const halProjects = projectsWithMasterRevision.map(p => hal.toProject(p.project, p.masterRevision));

  res.send({
    count: projects.length,
    _embedded: {
      projects: halProjects
    },
    _links: {
      self: {
        href: '/projects'
      }
    }
  });
});

server.get('/projects/:id', async (req, res) => {
  const [repo, directory] = Buffer.from(req.params['id'], 'base64').toString().split('|');
  const project = await projectRepository.findByRepoAndDir(repo, directory);

  res.send(hal.toProject(project));
});

server.get('/projects/:id/revisions/:revision', async (req, res) => {
  const [repo, directory] = Buffer.from(req.params['id'], 'base64').toString().split('|');
  const project = await projectRepository.findByRepoAndDir(repo, directory);
  const revision = await revisionRepository.findByProjectAndRev(project, req.params['revision']);

  res.send(await hal.toProjectRevision(project, revision));
});

server.get('/projects/:id/revisions/:revision/contracts/:name/raw-content', async (req, res) => {
  const [repo, directory] = Buffer.from(req.params['id'], 'base64').toString().split('|');
  const project = await projectRepository.findByRepoAndDir(repo, directory);
  const revision = await revisionRepository.findByProjectAndRev(project, req.params['revision']);
  const contract = revision.contracts.find(c => c.name === req.params['name']);

  recursive(`${revision.workspace.resolveContractsPath(contract.dir)}`, (err, files) => {
    if (err) {
      res.status(500).send(err);
    }

    files = files.map(f => {
      return {path: f, name: f.split(contract.dir)[1].substr(1)};
    });
    res.zip(files, `${project.repo}_${revision.rev()}_${contract.name}.zip`);
  });
});

server.use(bodyParser.json());
server.use(
  require('express-winston').logger({
    winstonInstance: config.logger,
    meta: true,
    expressFormat: true
  })
);

server.use(
  require('express-winston').errorLogger({
    winstonInstance: config.logger
  })
);

export default server;
