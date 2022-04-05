import { lookupPages } from '../../scripts/scripts.js';
import { LitElement, html, map } from '../../scripts/lit.min.js';

/* eslint-disable class-methods-use-this */

export class Jobs extends LitElement {
  static properties = {
    pathNames: { type: Array },
    jobs: { state: true, type: Array },
  };

  async connectedCallback() {
    super.connectedCallback();
    this.jobs = await lookupPages(this.pathNames);
  }

  createRenderRoot() {
    return this;
  }

  renderJob(job) {
    return html`
      <li class="cmp-jobs-list__item">
        <a class="cmp-job__link" href=${job.path}>${job.title}</a>
        <p class="cmp-job__department">${job.department}</p>
        <p class="cmp-job__location">${job.location}</p>
      </li>
    `;
  }

  render() {
    return html`
      <div class="jobs block">
        <ul class="cmp-jobs-list">
            ${map(this.jobs, (job) => this.renderJob(job))}
        </ul>
        <div class="cmp-jobs-view-all">
          <a class="cmp-jobs-view-all__link" href="/jobs/"><span>View all job openings</span></a>
        </div>
      </div>
    `;
  }
}
customElements.define('jobs-element', Jobs);

export default async function decorate(block) {
  const pathNames = [...block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  const jobsElement = document.createElement('jobs-element');
  jobsElement.setAttribute('pathNames', JSON.stringify(pathNames));
  block.innerHTML = '';
  block.appendChild(jobsElement);
}
