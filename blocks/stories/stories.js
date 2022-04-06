import { lookupPages, colormap } from '../../scripts/scripts.js';
import { createOptimizedPicture } from '../../scripts/core-scripts.js';
import { LitElement, html, map } from '../../scripts/lit.min.js';

/* eslint-disable class-methods-use-this */

export class Stories extends LitElement {
  static properties = {
    pathNames: { type: Array },
    stories: { state: true, type: Array },
  };

  async connectedCallback() {
    super.connectedCallback();
    this.stories = await lookupPages(this.pathNames);
  }

  createRenderRoot() {
    return this;
  }

  getPropertyText(propertyValue, className) {
    return propertyValue ? html`<p class='${className}'>${propertyValue}</p>` : html``;
  }

  renderCard(story) {
    const rowColor = story.color !== '' ? story.color : '#fff';
    const textColor = colormap[rowColor] === 'black' ? 'dark-text' : 'light-text';

    return html`
      <article class="cmp-stories-card ${textColor}" style="background-color: ${rowColor}">
        <a href=${story.path}>
          ${createOptimizedPicture(story.image, story.title, false, [{ media: '(min-width: 400px)', width: '2000' }, { width: '750' }], ['cmp-stories-card__media'])}
        </a>
        <div class="cmp-stories-card__body">
          <span class="cmp-stories-card__tag">${story.tag !== '' ? `${story.tag}` : ''}</span>
          <h2 class="cmp-stories-card__title">
            <a href="${story.path}">${story.title}</a>
          </h2>
          ${this.getPropertyText(story.subtitle, 'h2', 'cmp-stories-card__intro')}
          <div class="cmp-stories-card__attribution">
            ${this.getPropertyText(story.author, 'span', 'cmp-stories-card__author')}
            ${this.getPropertyText(story.authorTitle, 'span', 'cmp-stories-card__author-title')}
          </div>
        </div>
      </article>
    `;
  }

  render() {
    return html`
      ${map(this.stories, (story) => this.renderCard(story))}
    `;
  }
}
customElements.define('stories-element', Stories);

export default async function decorate(block) {
  const pathNames = [...block.querySelectorAll('a')].map((a) => new URL(a.href).pathname);
  const storiesElement = document.createElement('stories-element');
  storiesElement.setAttribute('pathNames', JSON.stringify(pathNames));
  block.innerHTML = '';
  block.appendChild(storiesElement);
}
