const addThousandsSeparator = (text: string) =>
    text.replaceAll(/\B(?<!(:?\.|e[+-]?)\d*)(?=(\d{3})+(?!\d))/g, ',');

export default addThousandsSeparator;