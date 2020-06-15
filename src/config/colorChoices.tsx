export interface Color {name: string, value: string, textColor: string}

const choices: Color[] = [
    { name: 'turquoise', value: '#1abc9c', textColor: '#fff' },
    { name: 'emerald', value: '#2ecc71', textColor: '#fff' },
    { name: 'greenSea', value: '#16a085', textColor: '#fff' },
    { name: 'nephritis', value: '#27ae60', textColor: '#fff' },
    { name: 'peterRiver', value: '#3498db', textColor: '#fff' },
    { name: 'belizeHole', value: '#2980b9', textColor: '#fff' },
    { name: 'amethyst', value: '#9b59b6', textColor: '#fff' },
    { name: 'wisteria', value: '#8e44ad', textColor: '#fff' },
    { name: 'wetAsphalt', value: '#34495e', textColor: '#fff' },
    { name: 'midnightBlue', value: '#2c3e50', textColor: '#fff' },
    { name: 'sunFlower', value: '#f1c40f', textColor: '#000' },
    { name: 'orange', value: '#f39c12', textColor: '#fff' },
    { name: 'carrot', value: '#e67e22', textColor: '#fff' },
    { name: 'pumpkin', value: '#d35400', textColor: '#fff' },
    { name: 'alizarin', value: '#e74c3c', textColor: '#fff' },
    { name: 'pomegranate', value: '#c0392b', textColor: '#fff' },
    { name: 'clouds', value: '#ecf0f1', textColor: '#000' },
    { name: 'silver', value: '#bdc3c7', textColor: '#000' },
    { name: 'soncrete', value: '#95a5a6', textColor: '#000' },
    { name: 'asbestos', value: '#7f8c8d', textColor: '#fff' },
];

export default choices;

export const findColorConfig = (name: string): Color => {
    if (name.startsWith('#')) {
        return {
            name,
            value: name,
            textColor: textColOf(name),
        }
    }
    const val =  choices.find(color => {
        if (color.name === name) return color;
        return false;
    });
    if (val) return val;
    else return choices[0];
}

export const textColOf = (hex: string): string => {
    if (!hex.startsWith('#')) return '#000';
    const short = hex.length === 4;

    const r = short ? parseInt(hex[1]+hex[1], 16) : parseInt(hex.slice(1,3), 16);
    const g = short ? parseInt(hex[2]+hex[2], 16) : parseInt(hex.slice(3,5), 16);
    const b = short ? parseInt(hex[3]+hex[3], 16) : parseInt(hex.slice(5,7), 16);

    return (r*0.299 + g*0.587 + b*0.114) > 186 ? '#000': '#fff';
}

export const defaultColor = () => {
    return choices[0].name;
}

export const defaultColorConfig = () => {
    return choices[0];
}