export const  generateColors = (data: { value: number; label: string; color: string; }[]) => {
    data.forEach(item => {
        item.color = `#${randomColor()}`;
    });
}

export const randomColor = (): string => {
    const chars = "0123456789abcdef";
    const colorCodeLength = 6;
    let colorCode = "";
    for (let index = 0; index < colorCodeLength; index++) {
        const randomNum = Math.floor(Math.random() * chars.length);
        colorCode += chars.substring(randomNum, randomNum + 1);
    }
    return colorCode;
}