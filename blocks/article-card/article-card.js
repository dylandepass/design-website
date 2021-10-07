import { convertToBackground, decorateLink, decorateTagLink, processDivisions, createDiv, wrapWithElement } from "../../scripts/helpers.js";

/**
 *
 * @param {HTMLElement} $block
 */
export default function decorate($block) {

    // Get the properties and identify the blocks
    const result = processDivisions($block, {
        image:      $div => $div.querySelector("picture"),
    });
    const props = result.properties;
    /** Text Consts: */
    const $text = createDiv({ cls: "text" });
    const $tag = decorateTagLink( createDiv({ content: props.tag }), { color: "black" } );
    const $hed = createDiv({ cls: "hed", content: props.hed });
    const $dek = createDiv({ cls: "dek", content: props.dek });
    const $byline = createDiv({ cls: "byline", content: props.author });
    // const link = wrapWithElement(document.createElement("a"), createDiv({ cls: "link-wrapper", content: "Hello" }));
    // link.attributes.href = result.properties.link || null;

    $text.append($tag, $hed, $dek, $byline);

    // Apply the properties to the block
    $block.style.backgroundColor = result.properties.background;
    $block.style.color = result.properties.textcolor;

    /* ---------  - IMAGES - ---------  */
    /**
     * Remove image and place on proper side:
     */
    result.image.remove();

    if (!result.properties["image-side"] || result.properties["image-side"] === "left") {
        result.blockContent.prepend(result.image);
    } else {
        result.blockContent.append(result.image);
    }

    result.image.classList.add("image");

    convertToBackground(result.image.querySelector("img"), result.image);

    /* -----------  - TEXT - -----------  */

    /** #Tag Link Text  / p   */
    // decorateTagLink( result.text.querySelector("p:first-child"), { color: "black" } );

    /** Title Text /  article-title  / h2  */

    /** SubTitle / / h3  */
    /** @type {HTMLAnchorElement} */
    // const link = result.text.querySelector("a");
    // decorateLink(link);
    // link.parentElement.classList.add("article-title");
    // result.properties.link = link.href;

    // $block.prepend($text);

    // decorateLink(link);

    $block.querySelector(":scope > div").prepend($text);
}



