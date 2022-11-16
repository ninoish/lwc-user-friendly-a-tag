import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class ATag extends NavigationMixin(LightningElement) {
  _href;
  @api
  get href() {
    return this._href;
  }
  set href(v) {
    this._href = v;
    if (!this.isConnected) {
      return;
    }
    this.generateUrl(v);
  }

  @api aTagStyle = "";
  @api target = "";
  @api name = "";
  @api mimeType = "";
  @api tabIndex = "";
  @api rel = "";

  url = "";
  isConnected = false;

  // @api setter is called before connectedCallback.
  // Using NavigationMixin before connectedCallback cause LWR Error.
  // Here makes sure that URL generation is called after connectedCallback.
  connectedCallback() {
    this.isConnected = true;
    if (!this.href) {
      return;
    }
    this.generateUrl(this.href);
  }

  generateUrl(href) {
    if (typeof href === "object") {
      // handle as page reference object
      this[NavigationMixin.GenerateUrl](href)
        .then((url) => {
          this.url = url;
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (typeof href === "string") {
      // handle as url
      this.url = href;
    } else {
      this.url = "#";
    }
  }

  nav(e) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return;
    }
    if (typeof this.href === "object") {
      e.preventDefault();
      this[NavigationMixin.Navigate](this.href);
    }
  }
}
