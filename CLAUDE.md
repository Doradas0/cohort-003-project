When function params are of the same type, it can be difficult to know what they represent.
Use object parameters to make it clear what each parameter represents.

```Typescript
// Bad
function isLessonBookmarked(currentUserId: string, lessonId: string) {
  // ...
}

// Good
function isLessonBookmarked(opts: {currentUserId: string, lessonId: string}) {
  const {currentUserId, lessonId} = opts;
  // ...
}
```

Anything marked as a `service` should have tests written in an acoompanying `.test.ts` file.

Do not use `any` in TypeScript. Instead use the most precise type possible while ensuring accuracy. If in doubt use `unknown` and then narrow the type as much as possible before using it.

```Typescript
// Bad
function getUser(id: string) {
  const user: any = database.findUserById(id);
  return user;
}

// Good
function getUser(id: string) {
  const user: unknown = database.findUserById(id);
  return validateUserResponse(user);
}
```
