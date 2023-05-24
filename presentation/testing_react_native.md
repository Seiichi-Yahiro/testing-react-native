---
marp: true
theme: default
class: 
    - invert

---

<style scoped>section { justify-content: start; }</style>

# Testing React Native

![bg 65%](diagram_testing.svg)

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

- Code-Qualität
   - Stellt sicher, dass der Code funktioniert
- Zeitersparnis
    - Probleme können frühzeitig erkannt werden bevor sie zu größeren Problemen werden
- Dokumentation
    - Zeigen wie der Code verwendet werden sollte und welche Ergebnisse zu erwarten sind

---

## Testbarer Code

- Kleine und fokussierte Komponenten / Funktionen
- Pure Functions / Props verwenden
- Trennen von Logic und UI
- Test Driven Development


---

## Jest

- Eine Test-Laufzeitumgebung von Facebook
- Unterstützt Snapshot-Tests, Unit-Tests, Integrationstests und End-to-End-Tests
- Code Coverage
- Mocking
- Einfach zu konfigurieren und auszuführen

![bg right 50%](jest_logo.png)

---

## Setup

Testframework Jest installieren

- jest
- @types/jest
- jest-expo

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
__tests__/components/myComponent.test.ts
```


---

## Tests schreiben


```js
it('should add thousands separators to integers', () => {
    const result = addThousandsSeparators('1234567890');
    const expected = '1,234,567,890';

    expect(result).toBe(expected);
});
```

```js
test('floats should not have thousands separators after the decimal point', () => {
    const result = addThousandsSeparators('12345.67890');
    const expected = '12,345.67890';

    expect(result).toBe(expected);
});
```

Ausführen
```
npm test
yarn test
```

---

## Async Tests

Async Funktion
```ts
it('should fetch something', async () => {
    const data = await fetchFromAPI();
    expect(data).toEqual(...);
});
```

Callback
```ts
it('should fetch something', done => {
    fetchFromAPI().then((data) => {
        expect(data).toEqual(...);
        done();
    });
})
```

---

## Gruppieren von Tests

```js
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

```ts
expect(x).toBe(y); // Exakte Gleichheit
expect(x).toEqual(y); // Inhaltliche Gleichheit

expect(x).toBeUndefined();
expect(x).not.toBeUndefined(); // negieren mit not

expect(x).toBeTruthy();
expect(x).toBeGreatherThan(y);

expect(x).toContain(y);
expect(x).toThrow(myError);
```

---

## Component Tests Setup

* @testing-library/react-native
* @testing-library/jest-native (optional für zusätzliche Matcher)
* react-test-renderer

```
npm install --save-dev @testing-library/react-native @testing-library/jest-native react-test-renderer
```

Wenn @testing-library/jest-native genutzt wird:
jest.config.json
```json
{
    "setupFilesAfterEnv": ["@testing-library/jest-native/extend-expect"]
}
```

---

## Component Tests

- Interaktion
    - Testen wie der User mit der Komponente interagiert
    - Was ändert sich durch eine Interaktion (z.B. ein Button wurde gedrückt)
    - Nicht den State change an sich testen sondern was wird dem User präsentiert
- Rendering
    - Aussehen und positionierung von Elementen

---

## Einfacher Render Test

```tsx
it('should add thousand separators to the price', () => {
    render(<Product item={{ id: '1', name: 'Foo', price: 234599 }} />);

    expect(screen.getByText('2,345.99€')).toBeOnTheScreen();
});
```

---

## Komplexer Render Test

### Snapshot Testing

- Konvertiert den gerenderten Output zu JSON
- JSON string wird in VCS mit aufgenommen
- Test vergleicht beide strings
- Für größeren Render Output

```ts
it('renders correctly', () => {
    const tree = renderer
        .create(<Product item={{ id: '1', name: 'Foo', price: 234599 }} />)
        .toJSON();
        
    expect(tree).toMatchSnapshot();
});
```

---

## Mocking

Erstellung eines Objektes, das den Funktionsumfang von realen Objekten nachahmt.

```ts
const mockedPlay = jest.fn();
const videoPlayerButtons = { play: mockedPlay, stop: () => {...} };
const mockedStop = jest.spyOn(videoPlayerButtons, 'stop');

mockedPlay.mockReturnValue(42);
mockedStop.mockImplementation((x) => x + 42);

const videoPlayer = new VideoPlayer(videoPlayerButtons);

expect(mockedPlay).toHaveBeenCalledTimes(1);
expect(mockedStop).toHaveBeenCalledWith(8);
```

---

## Interaktion

Vordefinierte Events
```ts
fireEvent.press(button);

fireEvent.changeText(input, 'new Text');

fireEvent.scroll(scrollView, {
  nativeEvent: {
    contentOffset: {
      y: 200,
    },
  },
});
```

Beliebige Events
```ts
fireEvent(button, 'pressIn');
fireEvent(button, 'longPress');
```

---

## Mocking und Interaktion

```tsx
import * as useFetch from './useFetch';

it('should be able to retry a failed api call', () => {
    const retry = jest.fn();

    jest.spyOn(useFetch, 'default').mockReturnValueOnce({
        status: useFetch.FetchStatus.Failed,
        retry,
    });

    render(<ProductList />);

    const retryButton = screen.getByText('Retry');
    expect(retryButton).toBeOnTheScreen();

    fireEvent.press(retryButton);
    expect(retry).toBeCalledTimes(1);
});
```

---

## Zusammenfassung

---

## Quellen
### Webseiten:

Jest: [https://jestjs.io](https://jestjs.io)
React Native Testing Library: [https://callstack.github.io/react-native-testing-library/](https://callstack.github.io/react-native-testing-library/)
React Native: [https://reactnative.dev/docs/testing-overview](https://reactnative.dev/docs/testing-overview)