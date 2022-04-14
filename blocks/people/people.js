import { lookupPages } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/helix-web-library.esm.min.js';
import { LitElement, html, map } from '../../scripts/lit.min.js';

/* eslint-disable class-methods-use-this */
export class People extends LitElement {
  static properties = {
    pathNames: { type: Array },
    people: { state: true, type: Array },
  };

  async connectedCallback() {
    super.connectedCallback();
    this.people = await lookupPages(this.pathNames);
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      ${map(this.people, (person) => html`
        <article class="cmp-person">
          <a href=${person.path}>
            ${createOptimizedPicture(person.image, person.title)}
          </a>
          <div class="cmp-person__body">
            <span class="cmp-person__tag">${person.tag}</span>
            <h2 class="cmp-person__name">
              <a href=${person.path}>${person.title}</a>
            </h2>
            <p class="cmp-person__title">${person.subtitle}</p>
          </div>
        </article>
      `)}`;
  }
}

customElements.define('people-element', People);

export default function decorate($block) {
  const pathNames = [...$block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  const peopleElement = document.createElement('people-element');
  peopleElement.setAttribute('pathNames', JSON.stringify(pathNames));
  $block.innerHTML = '';
  $block.appendChild(peopleElement);
}
