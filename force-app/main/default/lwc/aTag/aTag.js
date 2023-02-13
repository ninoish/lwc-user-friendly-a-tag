import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class ATag extends NavigationMixin(LightningElement) {
  _href;
  @api
  get href() {
    return this._href;
  }
  set href(v) {
    if (typeof v === "object") {
      // LWC framework bug causes Proxy error. Object Deep Clone needed here.
      this._href = JSON.parse(JSON.stringify(v));
    } else {
      this._href = v;
    }

    if (!this.isConnected) {
      return;
    }
    this.generateUrl(v);
  }

  @api htmlStyle = "";
  @api htmlClass = "";
  @api htmlTarget = "";
  @api htmlName = "";
  @api htmlMimeType = "";
  @api htmlTabIndex = "";
  @api htmlRel = "";

  // support reference types as attributes
  // https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_page_reference_type

  @api type;
  @api attrRecordId;
  @api attrAppTarget;
  @api attrPageRef; // TODO: support pageRef type and attributes
  @api attrObjectType;
  @api attrObjectInfo;
  @api attrComponentName;
  @api attrArticleType;
  @api attrUrlName;
  @api attrActionName;
  @api attrContentTypeName;
  @api attrContentKey;
  @api attrName;
  @api attrPageName;
  @api attrApiName;
  @api attrObjectApiName;
  @api attrRelationshipApiName;
  @api attrUrl;

  @api beforeNavCallback;
  @api afterNavCallback;

  @api state;

  url = "";
  isConnected = false;

  // @api setter is called before connectedCallback.
  // Using NavigationMixin before connectedCallback cause LWR Error.
  // Here makes sure that URL generation is called after connectedCallback.
  connectedCallback() {
    this.isConnected = true;
    if (!this.href) {
      // 個別にrefを構築
      if (typeof this.type === "string" && !!this.type) {
        this.generateRef();
      }
      return;
    }
    this.generateUrl(this.href);
  }

  generateRef() {
    const ref = {
      type: this.type,
      attributes: {
        recordId: this.attrRecordId,
        appTarget: this.attrAppTarget,
        pageRef: this.attrPageRef,
        objectType: this.attrObjectType,
        objectInfo: this.attrObjectInfo,
        componentName: this.attrComponentName,
        articleType: this.attrArticleType,
        urlName: this.attrUrlName,
        actionName: this.attrActionName,
        contentTypeName: this.attrContentTypeName,
        contentKey: this.attrContentKey,
        name: this.attrName,
        pageName: this.attrPageName,
        apiName: this.attrApiName,
        objectApiName: this.attrObjectApiName,
        relationshipApiName: this.attrRelationshipApiName,
        url: this.attrUrl
      }
    };
    if (typeof this.state === "object") {
      ref.state = this.state;
    }
    this[NavigationMixin.GenerateUrl](ref)
      .then((url) => {
        this.url = url;
      })
      .catch((err) => {
        console.error(err);
      });
    this._href = ref;
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
    const withKey = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
    const isRefType = typeof this.href === "object";
    if (
      this.beforeNavCallback !== null &&
      typeof this.beforeNavCallback === "function"
    ) {
      this.beforeNavCallback({
        withKey,
        isRefType
      });
    }
    if (!withKey && isRefType) {
      e.preventDefault();
      this[NavigationMixin.Navigate](this.href);
    }
    if (
      this.afterNavCallback !== null &&
      typeof this.afterNavCallback === "function"
    ) {
      this.afterNavCallback({
        withKey,
        isRefType
      });
    }
  }
}
