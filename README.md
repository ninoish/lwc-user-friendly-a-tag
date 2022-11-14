# LWC User Friendly `<a>` Tag

## Why this needed

[`NavigationMixin`](https://developer.salesforce.com/docs/component-library/bundle/lightning-navigation/documentation) is useful on LWC SPA development, but it doesn't handle browser default behaviours in an easy way, such as..

- Open in new tab (`command + click`, `ctrl + click`)
- Open in new window (`Shift + click`)

We also have to set `href` attribute value in `<a>` tag to support **user right clicking** , which value can be fetched by `NavigationMixin.GenerateUrl`.

This repo packages an example LWC component [**`<c-a-tag>`**](/force-app/main/default/lwc/aTag/) that handles browser default behaviours instead of `<a>` tag in LWC way.
**You don't have to use `NavigationMixin` in your component with this.** Just pass a [Page Reference](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/reference_page_reference_type) object or URL string to `href` attribute of the component.

## Code example

```exampleLwc.html
<template>
    <!-- Usecase 1 : Simple anchor -->
    <c-a-tag href={pageRef1}>Link here!</c-a-tag>

    <!-- Usecase 2 : Block style anchor -->
    <c-a-tag href={pageRef2} a-tag-style="display:block;">
        <div>
            <img src="https://example.com/abc123.png"/>
            <p>Hello LWC developers!</p>
        </div>
    </c-a-tag>

    <!-- Usecase 3 : URL String is also available -->
    <c-a-tag href="https://salesforce.com" target="_blank">
        <span>Click here</span>
    </c-a-tag>
<template>
```

```exampleLwc.js

import { LightningElement, track } from "lwc";

export default class ExampleLwc extends LightningElement {

    @track pageRef1;
    @track pageRef2;

    connectedCallback() {
        this.pageRef1 = {
            type: "standard__recordPage",
            attributes: {
                recordId: this.recordId,
                objectApiName: "AnotherCustomObject__c",
                actionName: "view"
            }
        };

        this.pageRef2 = {
            type: 'standard__app',
            attributes: {
                appTarget: 'standard__Sales',
            }
        };
    }

}

```

- Available in _LEX_ and _Experience Cloud_ (including _LWR_ ).
- Supports dynamic pageReference assignment.

## LICENSE

[MIT](/LICENSE)
