---
id: 29
milestone: Component Modifier
~github: pinely-international/tama#72
---

Another way is letting Components to define behaviors and the property name instead of enforcing it for everyone component.

It can be done by introducing a type which scopes props and gives an alternative as Props Scoped Behavior. And still introducing ProtonBehavior class, but it must be allowed explicitly by components with this.use(props.behavior).

A behavior should match props type, thus either behavior should extends props type or props type itself should include the behavior type. This opens a brand new way of organizing props types: you can create a type and behavior for theming and control the theme prop with the behavior.

```tsx
interface ReviewsProps {
  foo: "bar"
}

function Reviews(props: ReviewsProps | Proton.Behaviored<ReviewsProps>) {
  // This will bind `props.behavior` implicitly.
  return <div />
}

interface ReviewsProps {
  foo: "bar"
  
  flying: Proton.Behavior<this>
}

function Reviews(this: Proton.Component, props: ReviewsProps) {
  this.use(props.flying)
  return <div />
}

interface ReviewsProps extends Themeable {
  foo: "bar"
}

function Reviews(this: Proton.Component, props: ReviewsProps) {
  this.use(props.theme)

  return <div />
}


type Theme = string
interface Themeable { theme?: Theme | ThemeBehavior }
class ThemeBehavior extends Proton.Behavior<Theme> { ... }



abstract class ProtonBehavior<Input = unknown, Output> {
  abstract readonly input: Input
  public output()?: Output

  protected readonly view!: Proton.Component["view"]
  protected readonly context!: Proton.Component["context"]
}

class ReviewsBehavior extends ProtonBehavior {
  readonly props = { reviews: [], totalRating: 1, totalReviews: 2 }
  readonly reviews = this.context.require(class ReviewsContext { })

  constructor() {
    super()

    this.props.reviews = this.reviews.get()
  }
}
```
