---
marp: true
theme: uncover
class: 
    - invert
---

# Testing React Native

---

<!-- paginate: true -->

<style>
    section::after {
        padding: 20px;
        background: none;
        content: attr(data-marpit-pagination) '/' attr(data-marpit-pagination-total);
    }
</style>

---

## Motivation

---

## Statische Code-Analyse

- Linter
    - Unused Code
    - Pitfalls
    - Style Guide
- Type Checking

---

## Testbarer Code

- Aufteilen des Codes in mehrere Files
- Relativ kleine Funktionen
- Pure Funktions
- Trennen von Logic und UI

---

## Setup

Testframework Jest installieren
```
npm install jest @types/jest jest-expo --save-dev
```

jest.config.json
```json
{
    "preset": "jest-expo", // "react-native" ohne expo 
    "coverageReporters": [
      "html"
    ]
}
```

---

## Tests anlegen

Tests daneben
```
src/myComponent.ts
src/myComponent.test.ts
```

Tests daneben in einem Ordner
```
src/components/myComponent.ts
src/components/__tests__/myComponent.test.ts
```

Tests in eigenem Ordner
```
src/components/myComponent.ts
__tests__/components/myComponent.test.js
```


---

## Tests schreiben


```JavaScript
it('should add thousands separators to integers', () => {
    const result = addThousandsSeparators('1234567890');
    const expected = '1,234,567,890';

    expect(result).toBe(expected);
});
```

```JavaScript
test('floats should not have thousands separators after the decimal point', () => {
    const result = addThousandsSeparators('12345.67890');
    const expected = '12,345.67890';

    expect(result).toBe(expected);
});
```

---

## Gruppieren von Tests

```JavaScript
describe('Thousands separator', () => {
    it(...);
    it(...);

    describe('floats', () => {
        ...
    });
});
```

---

## Matchers

Gleichheit
```JavaScript
expect(x).toBe(y); // Exakte Gleichheit
expect(x).toEqual(y); // Inhaltliche Gleichheit
```

Wahrheit
```JavaScript
expect(x).toBeUndefined();
expect(x).not.toBeUndefined();
expect(x).toBeNull();

expect(x).toBeTruthy();
expect(x).toBeFalsy();
```
---

## Matchers

Zahlen
```JavaScript
expect(x).toBeGreatherThan(y);
expect(x).toBeLessThanOrEqual(y);
```

Arrays und Exceptions
```JavaScript
expect(x).toContain(y);
expect(x).toThrow(myError);
```

---

## Async Tests

```JavaScript
it('', async () => {
    const data = await fetchFromAPI();
    expect(data).toEqual(...);
});
```

---

## Component Tests

---

## Zusammenfassung