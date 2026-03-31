When function params are of the same type, it can be difficult to know what they represent.
Use object parameters to make it clear what each parameter represents.

```Typescript
// Bad
function createUser(name: string, age: number, email: string) {
  // ...
}

// Good
interface CreateUserParams {
  name: string;
  age: number;
  email: string;
}   

function createUser(params: CreateUserParams) {
  const { name, age, email } = params;
  // ...
}
```
