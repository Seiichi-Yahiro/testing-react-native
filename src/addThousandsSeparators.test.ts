import addThousandsSeparators from "./addThousandsSeparators";

describe('integers', () => {
    it('should not add thousands separators when <= 3 digits', () => {
        const result = addThousandsSeparators('123');
        const expected = '123';

        expect(result).toBe(expected);
    });

    it('should add thousands separators when > 3 digits', () => {
        const result = addThousandsSeparators('1234567890');
        const expected = '1,234,567,890';

        expect(result).toBe(expected);
    });
});

describe('floats', () => {
    it('should not add thousands separators after the decimal point', () => {
        const result = addThousandsSeparators('12345.67890');
        const expected = '12,345.67890';

        expect(result).toBe(expected);
    });
});

describe('scientific notation', () => {
    it('should not add thousands separators after e', () => {
        const result = addThousandsSeparators('1234567890e-5555');
        const expected = '1,234,567,890e-5555';

        expect(result).toBe(expected);
    });
});