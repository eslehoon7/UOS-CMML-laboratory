# Security Specification for CMML Lab Website

## 1. Data Invariants
- Research projects must have a title and unique ID.
- Members must have a name and role.
- Alumni must have a name.
- Gallery images must have a URL, year, and month.
- All write operations require being logged in as an authorized admin.

## 2. The "Dirty Dozen" Payloads (Examples)
1. Unauthenticated user trying to delete a research project.
2. Authenticated user trying to update a research project ID (immutable).
3. Authenticated user trying to add a member with a 2MB base64 string as name.
4. Authenticated user trying to create a gallery image with month 13.
5. Authenticated user trying to create a gallery image with negative year.
6. Authenticated user trying to modify `createdAt` of an existing gallery image.
7. Authenticated user trying to inject script tags into research description.
8. Authenticated user trying to spoof their identity by setting `authorId` to another UID (if we used it).
9. Authenticated user trying to delete settings without permission.
10. Authenticated user trying to list users if a user collection existed and was private.
11. Authenticated user trying to set `isAdmin: true` on their own profile (not applicable as we don't have separate user docs yet).
12. Authenticated user trying to bypass `affectedKeys().hasOnly()` by adding extra metadata fields.

## 3. Data Integrity & Validation Helpers
- `isValidId(id)`: Checks string size and regex.
- `isValidResearch(data)`: Validates research fields.
- `isValidMember(data)`: Validates member fields.
- `isValidGallery(data)`: Validates gallery fields.
- `isSignedIn()`: Checks for auth.
- `isAdmin()`: Check for specifically `admin@cmml.lab`.

## 4. Conflict Report Table
| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning |
| :--- | :--- | :--- | :--- |
| research | Handled by auth check | N/A | Size/Type checks inside `isValidResearch` |
| members | Handled by auth check | N/A | Size/Type checks inside `isValidMember` |
| alumni | Handled by auth check | N/A | Size/Type checks inside `isValidAlumni` |
| gallery | Handled by auth check | N/A | Size/Type checks inside `isValidGallery` |
| settings | Handled by auth check | N/A | Size/Type checks |
