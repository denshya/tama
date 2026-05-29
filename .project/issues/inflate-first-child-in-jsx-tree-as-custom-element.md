---
id: 5
assignee: FrameMuse
milestone: Resource Release
~github: pinely-international/tama#40
---

To allow proper release of resource when creating JSX trees with properties/children being Observables

```tsx
function Component() {
  return (
    <div className="cookies-banner" classMods={{ hasConsent: CookieConsent.state.is(x => x != null) }} hidden data-nosnippet>
      <div className="cookies-banner__header">
        <Icon className="cookies-banner__icon" name="cookie" />
        <div className="cookies-banner__buttons">
          <Button onClick={() => CookieConsent.state.set(false)}>Reject all</Button>
          <Button onClick={() => CookieConsent.state.set(true)}>Accept all</Button>
        </div>
      </div>
    </div>
  )
}
```

First element of the tree must be inflated as Custom Element to get access to `connected` and `disconnected` callbacks efficiently.

The whole tree (including all nested nodes) properties (that are Observables) will be released on `disconnectedCallback`, resubscribed on `connectedCallback` and nothing will happen on `connectedMoveCallback`.
